import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashCardBodyDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;
}

export class CreateFlashCardInputDto extends CreateFlashCardBodyDto {}

export class CreateFlashCardResponseDto {
  id: string;
  question: string;
  answer: string;
}

export class CreateFlashCardsResponseDto {
  flashCards: CreateFlashCardResponseDto[];
}
