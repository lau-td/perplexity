import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/libs/http';

export class ChatDifyInputDto {
  context: string;
}

export class ChatDifyBodyDto {
  response_mode: string;
  conversation_id: string;
  files: string[];
  query: string;
  inputs: ChatDifyInputDto;
  parent_message_id: string;
}

export class ChatDifyResponseDto {
  answer: string;
  conversation_id: string;
  message_id: string;
  statusCode: number;
  status: boolean;
  message: string;
}

export class ChatDifyDto extends HttpFetchDto {
  public static url = 'api/chat-messages';
  public method = HttpMethod.POST;
  public url = ChatDifyDto.url;
  public queryDto: undefined;
  public paramsDto: undefined;
  public responseDto: ChatDifyResponseDto;

  constructor(public bodyDto: ChatDifyBodyDto) {
    super();
  }
}
