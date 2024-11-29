import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class GenerateChaptersByUserBodyDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;
}

export class GenerateChaptersByUserInputDto extends GenerateChaptersByUserBodyDto {
  userId: string;
}

export class GenerateChaptersByUserResponseDto {
  @Expose()
  result: string;
}
