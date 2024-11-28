import { IsOptional, IsString } from 'class-validator';

export class UpdateDatasetBodyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDatasetInputDto extends UpdateDatasetBodyDto {
  id: string;
  userId: string;
}

export class UpdateDatasetResponseDto {
  id: string;
  name: string;
  description: string;
}
