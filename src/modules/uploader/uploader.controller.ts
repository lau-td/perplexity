import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDocumentCommand, YoutubeUrlsCommand } from './use-cases';
import { CommandBus } from '@nestjs/cqrs';
import { UploadDocumentDto, YoutubeUrlsDto } from './dtos';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(200)
  @Post('document')
  @FormDataRequest()
  uploadDocument(@Body() body: UploadDocumentDto) {
    return this.commandBus.execute(new UploadDocumentCommand(body.file));
  }

  @HttpCode(200)
  @Post('youtube')
  uploadYoutubeUrls(@Body() body: YoutubeUrlsDto) {
    return this.commandBus.execute(new YoutubeUrlsCommand(body.urls));
  }
}
