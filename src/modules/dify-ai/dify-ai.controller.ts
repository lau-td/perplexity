import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DifyAiService } from './dify-ai.service';
import { GetMessagesQueryDto } from './dtos';

@Controller('chat')
export class DifyAiController {
  constructor(private readonly difyAiService: DifyAiService) {}

  @Post()
  async chat(
    @Body()
    body: {
      query: string;
      documentId: string;
    },
  ) {
    return this.difyAiService.chat(body);
  }

  @Get('messages')
  async getMessages(@Query() query: GetMessagesQueryDto) {
    return this.difyAiService.getMessages(query);
  }
}
