import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDatasetDocumentJoinBodyDto {
  @IsNotEmpty()
  @IsUUID()
  datasetId: string;

  @IsNotEmpty()
  @IsUUID()
  documentId: string;
}

export class CreateDatasetDocumentJoinInputDto extends CreateDatasetDocumentJoinBodyDto {
  userId: string;
}

export class CreateDatasetDocumentJoinResponseDto {
  datasetId: string;
  documentId: string;
}
