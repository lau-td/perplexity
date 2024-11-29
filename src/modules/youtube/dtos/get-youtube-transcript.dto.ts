import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetYoutubeTranscriptBodyDto {
  @IsUUID()
  @IsNotEmpty()
  documentId: string;
}

export class GetYoutubeTranscriptInputDto extends GetYoutubeTranscriptBodyDto {
  userId: string;
}

export class GetYoutubeTranscriptResponseDto {
  start: number;
  end: number;
  text: string;
}
