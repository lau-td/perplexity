import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDatasetBodyDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;
}

export class DeleteDatasetInputDto extends DeleteDatasetBodyDto {
  userId: string;
}
