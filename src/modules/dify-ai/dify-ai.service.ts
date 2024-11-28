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
import { fetchDto } from 'src/common/libs/http';
import { DifyAiConfig } from 'src/config';
import { ConfigType } from '@nestjs/config';
import { IDocumentRepository, IUserRepository } from 'src/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';

@Injectable()
export class DifyAiService {
  constructor(
    private readonly httpService: HttpService,

    @Inject(DifyAiConfig.KEY)
    private readonly config: ConfigType<typeof DifyAiConfig>,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async getPassport(input: GetPassportDifyAiInputDto): Promise<string> {
    try {
      const xAppCode = this.config.appCode;
      const dto = new GetPassportDto(input.body, input.headers);
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
    query: string,
    conversation_id: string,
    parent_message_id: string,
  ): ChatDifyBodyDto {
    return {
      response_mode: 'blocking',
      conversation_id: conversation_id,
      files: [],
      query: query,
      inputs: null,
      parent_message_id: parent_message_id,
    };
  }

  async chat(input: ChatInputDto): Promise<ChatResponseDto> {
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

      const payload = this.createChatPayload(
        input.query,
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

      if (!document.conversationId) {
        await this.documentRepository.update(document.id, {
          conversationId: response.data.conversation_id,
        });
      }

      await this.documentRepository.update(document.id, {
        parentMessageId: response.data.message_id,
      });

      const responseData = response.data.answer;

      return {
        message: responseData,
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
}
