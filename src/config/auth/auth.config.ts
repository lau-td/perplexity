import { registerAs } from '@nestjs/config';
import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.AUTH, () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET,
  jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '1d',
}));
