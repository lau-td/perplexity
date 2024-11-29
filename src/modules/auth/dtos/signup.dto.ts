import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;
}

export class SignupResponseDto {
  @Expose()
  accessToken: string;
}
