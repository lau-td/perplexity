import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateYoutubeSummaryBodyDto {
  @IsNotEmpty()
  @IsString()
  videoId: string;
}

export class GenerateYoutubeSummaryInputDto extends GenerateYoutubeSummaryBodyDto {}

export class GenerateYoutubeSummaryResponseDto {
  result: string;
}
