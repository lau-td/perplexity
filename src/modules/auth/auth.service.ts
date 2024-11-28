import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IUserRepository } from 'src/core/repository';
import { LoginDto, LoginResponseDto } from './dtos';
import { AuthPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = await this.generateToken(payload);

    return { accessToken: token };
  }

  async generateToken(payload: AuthPayload) {
    return this.jwtService.sign(payload);
  }
}
