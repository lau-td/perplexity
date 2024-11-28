import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { DifyAiService } from './dify-ai.service';
import { ChatInputDto, GetMessagesQueryDto } from './dtos';
import { Response } from 'express';

@Controller('chat')
export class DifyAiController {
  constructor(private readonly difyAiService: DifyAiService) {}

  @Post()
  async chat(@Body() body: ChatInputDto) {
    return this.difyAiService.chatMessageBlock(body);
  }

  @Post('stream')
  async chatStream(@Body() body: ChatInputDto, @Res() res: Response) {
    const result = await this.difyAiService.chatMessageStream(body);

    // Set the appropriate headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let conversationId = '';
    let messageId = '';

    result.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.event === 'message_end') {
              conversationId = data.conversation_id;
              messageId = data.message_id;
            }
          } catch (e) {
            // Skip invalid JSON
            continue;
          }
        }
      }
      res.write(chunk);
    });

    result.on('end', async () => {
      if (conversationId && messageId) {
        // Update document with conversation and message IDs
        await this.difyAiService.updateDocumentWithMessageInfo(
          body.documentId,
          conversationId,
          messageId,
        );
      }
      res.end();
    });
  }

  @Get('messages')
  async getMessages(@Query() query: GetMessagesQueryDto) {
    return this.difyAiService.getMessages(query);
  }
}
