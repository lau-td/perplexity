import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  GenerateYoutubeSummaryCommand,
  GetFlashCardCommand,
  CreateFlashCardCommand,
} from './use-cases';
import {
  GetFlashCardQueryDto,
  CreateFlashCardBodyDto,
  GenerateYoutubeSummaryBodyDto,
} from './dtos';

@Controller('llm-tasks')
export class LlmTaskController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('youtube-summary')
  generateYoutubeSummary(@Body() body: GenerateYoutubeSummaryBodyDto) {
    return this.commandBus.execute(new GenerateYoutubeSummaryCommand(body));
  }

  @Get('flash-card')
  getFlashCard(@Query() query: GetFlashCardQueryDto) {
    return this.commandBus.execute(new GetFlashCardCommand(query));
  }

  @Post('flash-card')
  createFlashCard(@Body() body: CreateFlashCardBodyDto) {
    return this.commandBus.execute(new CreateFlashCardCommand(body));
  }
}
