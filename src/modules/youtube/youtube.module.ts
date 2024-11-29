import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetYoutubeTranscriptCommandHandler,
  GetYoutubeSummaryCommandHandler,
  GetYoutubeInfoCommandHandler,
} from './use-cases';
import { YoutubeController } from './youtube.controller';

const Handlers = [
  GetYoutubeTranscriptCommandHandler,
  GetYoutubeSummaryCommandHandler,
  GetYoutubeInfoCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [YoutubeController],
  providers: [...Handlers],
})
export class YoutubeModule {}
