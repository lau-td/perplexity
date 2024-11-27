import { Module } from '@nestjs/common';

import { UploadDocumentCommandHandler } from './use-cases';
import { UploaderController } from './uploader.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { YoutubeUrlsCommandHandler } from './use-cases';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { LlmTaskModule } from '../llm-task/llm-task.module';

const Handlers = [UploadDocumentCommandHandler, YoutubeUrlsCommandHandler];

@Module({
  imports: [CqrsModule, NestjsFormDataModule, VectorStoreModule, LlmTaskModule],
  controllers: [UploaderController],
  providers: [...Handlers],
  exports: [],
})
export class UploaderModule {}
