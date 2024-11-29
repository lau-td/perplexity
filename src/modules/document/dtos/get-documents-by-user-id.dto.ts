import { Expose } from 'class-transformer';

export class GetDocumentsByUserIdInputDto {
  userId: string;
}

export class GetDocumentsByUserIdResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  youtubeId: string;

  @Expose()
  conversationId: string;

  @Expose()
  parentMessageId: string;
}
