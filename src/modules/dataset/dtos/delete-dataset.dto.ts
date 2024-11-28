import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDatasetInputDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;

  userId: string;
}
