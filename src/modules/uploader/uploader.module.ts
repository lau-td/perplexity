import { Module } from '@nestjs/common';

import { UploadDocumentCommandHandler } from './use-cases';
import { UploaderController } from './uploader.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { YoutubeUrlsCommandHandler } from './use-cases';

const Handlers = [UploadDocumentCommandHandler, YoutubeUrlsCommandHandler];

@Module({
  imports: [CqrsModule, NestjsFormDataModule],
  controllers: [UploaderController],
  providers: [...Handlers],
  exports: [],
})
export class UploaderModule {}
