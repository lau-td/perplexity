import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { LlmTaskModule } from '../llm-task/llm-task.module';
import { AuthModule } from '../auth/auth.module';
import { UploaderController } from './uploader.controller';
import {
  UploadDocumentCommandHandler,
  YoutubeUrlsCommandHandler,
} from './use-cases';

const Handlers = [UploadDocumentCommandHandler, YoutubeUrlsCommandHandler];

@Module({
  imports: [
    CqrsModule,
    NestjsFormDataModule,
    VectorStoreModule,
    LlmTaskModule,
    AuthModule,
  ],
  controllers: [UploaderController],
  providers: [...Handlers],
  exports: [],
})
export class UploaderModule {}
