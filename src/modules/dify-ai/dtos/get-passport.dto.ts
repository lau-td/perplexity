import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/libs/http';

export class GetPassportResponseDto {
  access_token: string;
}

export class GetPassportDifyAiBodyDto {
  email: string;
}

export class GetPassportDifyAiHeadersDto {
  'x-app-code': string;
}

export class GetPassportDifyAiInputDto {
  headers: GetPassportDifyAiHeadersDto;
  body: GetPassportDifyAiBodyDto;
}

export class GetPassportDto extends HttpFetchDto {
  public static url = 'v1/codelight/passport';
  public method = HttpMethod.POST;
  public url = GetPassportDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: GetPassportResponseDto;

  constructor(
    public bodyDto: GetPassportDifyAiBodyDto,
    public headers: GetPassportDifyAiHeadersDto,
  ) {
    super();
  }
}
