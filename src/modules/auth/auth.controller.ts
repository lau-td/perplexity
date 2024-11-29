import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  LoginResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dtos';
import { IsPublic } from 'src/common/decorators';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(dto);
    return plainToInstance(LoginResponseDto, token);
  }

  @Post('signup')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async signup(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    const token = await this.authService.signup(dto);
    return plainToInstance(SignupResponseDto, token);
  }
}
