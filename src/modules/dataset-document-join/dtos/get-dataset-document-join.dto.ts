import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetDatasetDocumentJoinByDatasetInputDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;

  userId: string;
}

export class GetDatasetDocumentJoinResponseDto {
  datasetId: string;
  documentId: string;
}
