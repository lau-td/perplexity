import { IsNotEmpty, IsString } from 'class-validator';

export class ChatInputDto {
  @IsNotEmpty()
  @IsString()
  query: string;

  @IsNotEmpty()
  @IsString()
  documentId: string;
}

export class ChatResponseDto {
  answer: string;
}
