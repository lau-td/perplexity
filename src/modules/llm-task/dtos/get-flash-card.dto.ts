import { IsNotEmpty, IsString } from 'class-validator';

export class GetFlashCardQueryDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;
}

export class GetFlashCardInputDto extends GetFlashCardQueryDto {}

export class GetFlashCardResponseDto {
  question: string;
  answer: string;
}
