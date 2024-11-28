import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
}

export class LoginResponseDto {
  @Expose()
  accessToken: string;
}
