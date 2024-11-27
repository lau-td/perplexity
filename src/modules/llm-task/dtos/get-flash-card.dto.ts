import { IsNotEmpty, IsString } from 'class-validator';

export class GetFlashCardBodyDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;
}

export class GetFlashCardInputDto extends GetFlashCardBodyDto {}

export class GetFlashCardResponseDto {
  question: string;
  answer: string;
}

export class GetFlashCardsResponseDto {
  flashCards: GetFlashCardResponseDto[];
}
