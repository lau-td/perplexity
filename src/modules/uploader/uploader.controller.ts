import { Controller, Post, HttpCode, Body, UseGuards } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UploadDocumentCommand, YoutubeUrlsCommand } from './use-cases';
import { CommandBus } from '@nestjs/cqrs';
import { UploadDocumentDto, YoutubeUrlsDto } from './dtos';
import { CurrentUser } from 'src/common/decorators';
import { AuthPayload } from './interfaces';
import { JwtAuthGuard } from 'src/common/guards';

@Controller('uploader')
@UseGuards(JwtAuthGuard)
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
  uploadYoutubeUrls(
    @CurrentUser() user: AuthPayload,
    @Body() body: YoutubeUrlsDto,
  ) {
    return this.commandBus.execute(
      new YoutubeUrlsCommand(body.urls, user.userId),
    );
  }
}
