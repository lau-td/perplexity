import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDatasetDocumentJoinBodyDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;

  @IsNotEmpty()
  @IsUUID()
  documentId: string;
}

export class DeleteDatasetDocumentJoinInputDto extends DeleteDatasetDocumentJoinBodyDto {
  userId: string;
}
