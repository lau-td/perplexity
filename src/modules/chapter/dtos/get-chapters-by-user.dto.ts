import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class GetChaptersByUserQueryDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;
}

export class GetChaptersByUserInputDto extends GetChaptersByUserQueryDto {
  userId: string;
}

export class GetChaptersByUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  position: number;

  @Expose()
  subtitle: string;
}
