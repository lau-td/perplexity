import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDatasetBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateDatasetInputDto extends CreateDatasetBodyDto {
  userId: string;
}

export class CreateDatasetResponseDto {
  id: string;
  name: string;
  description: string;
}
