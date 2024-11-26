import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { LlmTaskController } from './llm-task.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GenerateYoutubeSummaryCommandHandler } from './use-cases';

const Handlers = [GenerateYoutubeSummaryCommandHandler];

@Module({
  imports: [CqrsModule],
  controllers: [LlmTaskController],
  providers: [OpenAIService, ...Handlers],
  exports: [],
})
export class LlmTaskModule {}
