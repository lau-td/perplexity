import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class UrlInputDto {
  @IsArray()
  @IsString({ each: true })
  urls: string[];
}

export class YoutubeUrlsInputDto extends UrlInputDto {
  userId: string;
}

export class YoutubeUrlsResponseDto {
  @Expose()
  documentId: string;

  @Expose()
  youtubeId: string;
}
