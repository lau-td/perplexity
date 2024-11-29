import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetYoutubeInfoBodyDto, GetYoutubeSummaryBodyDto } from './dtos';
import { GetYoutubeTranscriptBodyDto } from './dtos';
import {
  GetYoutubeInfoCommand,
  GetYoutubeSummaryCommand,
  GetYoutubeTranscriptCommand,
} from './use-cases';
import { UserEntity } from 'src/core/entities';
import { CurrentUser } from 'src/common/decorators';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('transcript')
  async getYoutubeTranscript(
    @Query() query: GetYoutubeTranscriptBodyDto,
    @CurrentUser() user: UserEntity & { userId: string },
  ) {
    return this.commandBus.execute(
      new GetYoutubeTranscriptCommand({ ...query, userId: user.userId }),
    );
  }

  @Get('summary')
  async getYoutubeSummary(
    @Query() query: GetYoutubeSummaryBodyDto,
    @CurrentUser() user: UserEntity & { userId: string },
  ) {
    return this.commandBus.execute(
      new GetYoutubeSummaryCommand({ ...query, userId: user.userId }),
    );
  }

  @Get('info')
  async getYoutubeInfo(@Query() query: GetYoutubeInfoBodyDto) {
    return this.commandBus.execute(new GetYoutubeInfoCommand({ ...query }));
  }
}
