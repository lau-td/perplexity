export class YoutubeDto {
  name: string;
  videoId: string;
  url: string;
}

export class GetDatasetDocumentDto {
  id: string;
  youtube: YoutubeDto;
}

export class GetDatasetResponseDto {
  id: string;
  name: string;
  description: string;
  documents: GetDatasetDocumentDto[];
}
