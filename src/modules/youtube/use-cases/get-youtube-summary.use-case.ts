import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDocumentRepository, IYoutubeRepository } from 'src/core/repository';
import {
  GetYoutubeSummaryInputDto,
  GetYoutubeSummaryResponseDto,
} from '../dtos';

export class GetYoutubeSummaryCommand implements ICommand {
  constructor(public readonly input: GetYoutubeSummaryInputDto) {}
}

@CommandHandler(GetYoutubeSummaryCommand)
export class GetYoutubeSummaryCommandHandler
  implements
    ICommandHandler<GetYoutubeSummaryCommand, GetYoutubeSummaryResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(
    command: GetYoutubeSummaryCommand,
  ): Promise<GetYoutubeSummaryResponseDto> {
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

    return {
      result: youtubeInfo.summary,
    };
  }
}
