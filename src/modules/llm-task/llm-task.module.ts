import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { LlmTaskController } from './llm-task.controller';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GenerateYoutubeSummaryCommandHandler,
  GetFlashCardCommandHandler,
  CreateFlashCardCommandHandler,
  EnhanceUserQueryCommandHandler,
} from './use-cases';

const Handlers = [
  GenerateYoutubeSummaryCommandHandler,
  GetFlashCardCommandHandler,
  CreateFlashCardCommandHandler,
  EnhanceUserQueryCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [LlmTaskController],
  providers: [OpenAIService, ...Handlers],
  exports: [OpenAIService],
})
export class LlmTaskModule {}
