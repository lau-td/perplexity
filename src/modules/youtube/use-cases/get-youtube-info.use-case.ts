import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDocumentRepository, IYoutubeRepository } from 'src/core/repository';
import { GetYoutubeInfoInputDto, GetYoutubeInfoResponseDto } from '../dtos';
import { plainToInstance } from 'class-transformer';

export class GetYoutubeInfoCommand implements ICommand {
  constructor(public readonly input: GetYoutubeInfoInputDto) {}
}

@CommandHandler(GetYoutubeInfoCommand)
export class GetYoutubeInfoCommandHandler
  implements ICommandHandler<GetYoutubeInfoCommand, GetYoutubeInfoResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(
    command: GetYoutubeInfoCommand,
  ): Promise<GetYoutubeInfoResponseDto> {
    const document = await this.documentRepository.findOne({
      id: command.input.documentId,
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const youtubeInfo = await this.youtubeRepository.findOne({
      id: document.youtubeId,
    });

    if (!youtubeInfo) {
      throw new NotFoundException('Youtube info not found');
    }

    return plainToInstance(GetYoutubeInfoResponseDto, youtubeInfo);
  }
}
