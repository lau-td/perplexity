import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IYoutubeRepository } from 'src/core/repository';
import {
  convertTranscriptToJson,
  convertTranscriptToText,
  getYoutubeInfo,
  getYoutubeTranscript,
} from 'src/utils';

export class YoutubeUrlsCommand implements ICommand {
  constructor(public readonly urls: string[]) {}
}

@CommandHandler(YoutubeUrlsCommand)
export class YoutubeUrlsCommandHandler
  implements ICommandHandler<YoutubeUrlsCommand, string>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,
  ) {}

  async execute(command: YoutubeUrlsCommand) {
    try {
      const { urls } = command;
      const [transcript, info] = await Promise.all([
        getYoutubeTranscript(urls[0]),
        getYoutubeInfo(urls[0]),
      ]);

      const formattedTranscriptInJson = convertTranscriptToJson(transcript);
      const formattedTranscriptInText = convertTranscriptToText(transcript);

      await this.youtubeRepository.create({
        name: info.title,
        url: info.videoUrl,
        videoId: info.videoId,
        metadata: {
          transcript: formattedTranscriptInJson,
          text: formattedTranscriptInText,
          ...info,
        },
      });

      return 'success';
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      throw error;
    }
  }
}
