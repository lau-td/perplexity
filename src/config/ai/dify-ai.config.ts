import { registerAs } from '@nestjs/config';
import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.DIFY_AI, () => ({
  baseUrl: process.env.DIFY_BASE_URL,
  appCode: process.env.DIFY_APP_CODE,
}));
