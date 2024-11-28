import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDatasetDocumentJoinInputDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;

  @IsNotEmpty()
  @IsUUID()
  documentId: string;

  userId: string;
}
