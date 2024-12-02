import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';
import {
  ChatDifyBodyDto,
  ChatDifyDto,
  ChatDifyResponseDto,
  ChatInputDto,
  GetPassportDifyAiInputDto,
  GetPassportDto,
  GetPassportResponseDto,
  GetMessagesDto,
  GetMessagesQueryDto,
  GetMessagesResponseDto,
  ChatResponseDto,
} from './dtos';
import { fetchDto, fetchStreamDto } from 'src/common/libs/http';
import { DifyAiConfig } from 'src/config';
import { ConfigType } from '@nestjs/config';
import {
  IDocumentRepository,
  IUserRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { VectorStoreService } from '../vector-store/vector-store.service';
import { Readable } from 'stream';
import { EnhanceUserQueryCommand } from '../llm-task/use-cases';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class DifyAiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly commandBus: CommandBus,

    @Inject(DifyAiConfig.KEY)
    private readonly config: ConfigType<typeof DifyAiConfig>,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,
  ) {}

  async getPassport(input: GetPassportDifyAiInputDto): Promise<string> {
    try {
      const xAppCode = this.config.appCode;
      const dto = new GetPassportDto(
        {
          ...input.body,
        },
        input.headers,
      );
      const response = await fetchDto<GetPassportResponseDto>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          'X-App-Code': xAppCode,
        }),
      });
      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to get passport',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private createChatPayload(
    responseMode: 'blocking' | 'streaming',
    query: string,
    context: string,
    conversation_id: string,
    parent_message_id: string,
  ): ChatDifyBodyDto {
    return {
      response_mode: responseMode,
      conversation_id: conversation_id !== '' ? conversation_id : null,
      files: [],
      query: query,
      inputs: {
        context: context,
      },
      parent_message_id: parent_message_id !== '' ? parent_message_id : null,
    };
  }

  async getContext(
    userId: string,
    documentIds: string[],
    query: string,
  ): Promise<string> {
    try {
      const searchResults = await this.vectorStoreService.searchByQuery(
        userId,
        query,
        documentIds,
      );
      const context = searchResults.map((result) => result.text).join('\n\n');

      return context;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get context',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async enhanceUserQuery(query: string): Promise<string> {
    const command = new EnhanceUserQueryCommand({ query });
    const result = await this.commandBus.execute(command);
    return result.result;
  }

  async chatMessageBlock(input: ChatInputDto): Promise<ChatResponseDto> {
    try {
      const document = await this.documentRepository.findOne({
        id: input.documentId,
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const user = await this.userRepository.findOne({
        id: document.userId,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.getPassport({
        body: {
          email: user.email,
        },
        headers: {
          'x-app-code': this.config.appCode,
        },
      });

      const enhancedQuery = await this.enhanceUserQuery(input.query);

      const context = await this.getContext(
        document.userId,
        [document.id],
        enhancedQuery,
      );

      const payload = this.createChatPayload(
        'blocking',
        enhancedQuery,
        context,
        document.conversationId,
        document.parentMessageId,
      );
      const dto = new ChatDifyDto(payload);
      const response = await fetchDto<ChatDifyResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
        dto,
      });
      if (!response.status) {
        throw new HttpException(
          response.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.updateDocumentWithMessageInfo(
        document.id,
        response.data.conversation_id,
        response.data.message_id,
      );

      const responseData = response.data.answer;

      return {
        answer: responseData,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async chatMessageStream(input: ChatInputDto): Promise<Readable> {
    try {
      const document = await this.documentRepository.findOne({
        id: input.documentId,
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const user = await this.userRepository.findOne({
        id: document.userId,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.getPassport({
        body: {
          email: user.email,
        },
        headers: {
          'x-app-code': this.config.appCode,
        },
      });

      const youtube = await this.youtubeRepository.findOne({
        id: document.youtubeId,
      });

      if (!youtube) {
        throw new NotFoundException('Youtube not found');
      }

      const enhancedQuery = await this.enhanceUserQuery(input.query);

      const context = await this.getContext(
        document.userId,
        [document.id],
        enhancedQuery,
      );

      const payload = this.createChatPayload(
        'streaming',
        enhancedQuery,
        context +
          '---------------' +
          JSON.stringify({
            youtubeTitle: youtube.name,
            youtubeSummary: youtube.summary,
          }),
        document.conversationId,
        document.parentMessageId,
      );
      const dto = new ChatDifyDto(payload);
      const response = await fetchStreamDto({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
        dto,
      });
      if (!response.status) {
        throw new HttpException(
          response.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessages(
    query: GetMessagesQueryDto,
  ): Promise<GetMessagesResponseDto> {
    try {
      const document = await this.documentRepository.findOne({
        id: query.documentId,
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const user = await this.userRepository.findOne({
        id: document.userId,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.getPassport({
        body: {
          email: user.email,
        },
        headers: {
          'x-app-code': this.config.appCode,
        },
      });

      const dto = new GetMessagesDto({
        conversation_id: document.conversationId,
      });
      const response = await fetchDto<GetMessagesResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
        dto,
      });

      if (!response.status) {
        throw new HttpException(
          response.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDocumentWithMessageInfo(
    documentId: string,
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    const document = await this.documentRepository.findOne({
      id: documentId,
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (!document.conversationId) {
      await this.documentRepository.update(document.id, {
        conversationId: conversationId,
      });
    }

    await this.documentRepository.update(document.id, {
      parentMessageId: messageId,
    });
  }
}
