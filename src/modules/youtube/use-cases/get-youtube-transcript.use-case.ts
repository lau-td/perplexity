import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDocumentRepository, IYoutubeRepository } from 'src/core/repository';
import {
  GetYoutubeTranscriptInputDto,
  GetYoutubeTranscriptResponseDto,
} from '../dtos';

export class GetYoutubeTranscriptCommand implements ICommand {
  constructor(public readonly input: GetYoutubeTranscriptInputDto) {}
}

@CommandHandler(GetYoutubeTranscriptCommand)
export class GetYoutubeTranscriptCommandHandler
  implements
    ICommandHandler<
      GetYoutubeTranscriptCommand,
      GetYoutubeTranscriptResponseDto[]
    >
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(
    command: GetYoutubeTranscriptCommand,
  ): Promise<GetYoutubeTranscriptResponseDto[]> {
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

    return youtubeInfo.metadata.transcript;
  }
}
