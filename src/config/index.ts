import TypeOrmNestDatabaseConfig from './database/typeorm-nest/database.config';
import DifyAiConfig from './ai/dify-ai.config';
import AuthConfig from './auth/auth.config';

export const configurations = [
  TypeOrmNestDatabaseConfig,
  DifyAiConfig,
  AuthConfig,
];

export { TypeOrmNestDatabaseConfig, DifyAiConfig, AuthConfig };
