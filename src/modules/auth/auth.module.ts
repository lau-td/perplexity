import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthConfig } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(AuthConfig)],
      useFactory: async (config: ConfigType<typeof AuthConfig>) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: parseInt(config.jwtExpiresIn, 10),
        },
      }),
      inject: [AuthConfig.KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
