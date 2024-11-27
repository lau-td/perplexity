import { IsNotEmpty, IsString } from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/libs/http';

export class GetMessagesQueryDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;
}

export class GetMessagesDifyAiQueryDto {
  conversation_id: string;
}

export class MessageDto {
  id: string;
  conversation_id: string;
  content: string;
  role: string;
  created_at: string;
}

export class GetMessagesResponseDto {
  data: MessageDto[];
  has_more: boolean;
  limit: number;
  total: number;
  page: number;
}

export class GetMessagesDto extends HttpFetchDto {
  public static url = 'api/messages/pagination';
  public method = HttpMethod.GET;
  public url = GetMessagesDto.url;
  public bodyDto = undefined;
  public paramsDto = undefined;
  public responseDto: GetMessagesResponseDto;

  constructor(public queryDto: GetMessagesDifyAiQueryDto) {
    super();
  }
}
