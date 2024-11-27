import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SearchByQueryDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  query: string;

  @IsUUID(4, { each: true })
  documentIds?: string[];
}
