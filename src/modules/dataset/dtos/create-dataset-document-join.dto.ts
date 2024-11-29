import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDatasetDocumentJoinBodyDto {
  @IsNotEmpty()
  @IsUUID()
  documentId: string;
}

export class CreateDatasetDocumentJoinInputDto extends CreateDatasetDocumentJoinBodyDto {
  datasetId: string;
  userId: string;
}

export class CreateDatasetDocumentJoinYoutubeDto {
  name: string;
  videoId: string;
  url: string;
}

export class CreateDatasetDocumentJoinDocumentDto {
  id: string;
  youtube: CreateDatasetDocumentJoinYoutubeDto;
}

export class CreateDatasetDocumentJoinResponseDto {
  result: string;
}
