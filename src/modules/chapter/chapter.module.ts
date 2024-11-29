import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { CqrsModule } from '@nestjs/cqrs';

import {
  GenerateChaptersByUserCommandHandler,
  GetChaptersByUserQueryHandler,
} from './use-cases';
import { LlmTaskModule } from '../llm-task/llm-task.module';

const Handlers = [
  GenerateChaptersByUserCommandHandler,
  GetChaptersByUserQueryHandler,
];

@Module({
  imports: [CqrsModule, LlmTaskModule],
  controllers: [ChapterController],
  providers: [...Handlers],
})
export class ChapterModule {}
