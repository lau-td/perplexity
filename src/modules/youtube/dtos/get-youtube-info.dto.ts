import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetYoutubeInfoBodyDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;
}

export class GetYoutubeInfoInputDto extends GetYoutubeInfoBodyDto {}

export class GetYoutubeInfoResponseDto {
  @Expose()
  name: string;

  @Expose()
  videoId: string;

  @Expose()
  url: string;
}
