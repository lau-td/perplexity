import { IsNotEmpty, IsString } from 'class-validator';

export class EnhanceUserQueryBodyDto {
  @IsNotEmpty()
  @IsString()
  query: string;
}

export class EnhanceUserQueryInputDto extends EnhanceUserQueryBodyDto {}

export class EnhanceUserQueryResponseDto {
  result: string;
}
