import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetYoutubeSummaryBodyDto {
  @IsUUID()
  @IsNotEmpty()
  documentId: string;
}

export class GetYoutubeSummaryInputDto extends GetYoutubeSummaryBodyDto {
  userId: string;
}

export class GetYoutubeSummaryResponseDto {
  result: string;
}
