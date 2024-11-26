import { IsArray, IsString } from 'class-validator';

export class UrlInputDto {
  @IsArray()
  @IsString({ each: true })
  urls: string[];
}

export class YoutubeUrlsDto extends UrlInputDto {}

export class SpotifyUrlsDto extends UrlInputDto {}
