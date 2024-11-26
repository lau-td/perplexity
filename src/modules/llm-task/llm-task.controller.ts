import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GenerateYoutubeSummaryCommand } from './use-cases';
import { GenerateYoutubeSummaryInputDto } from './dtos';

@Controller('llm-tasks')
export class LlmTaskController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('youtube-summary')
  generateYoutubeSummary(@Body() body: GenerateYoutubeSummaryInputDto) {
    return this.commandBus.execute(new GenerateYoutubeSummaryCommand(body));
  }
}
