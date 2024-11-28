import TypeOrmNestDatabaseConfig from './database/typeorm-nest/database.config';
import DifyAiConfig from './ai/dify-ai.config';

export const configurations = [TypeOrmNestDatabaseConfig, DifyAiConfig];

export { TypeOrmNestDatabaseConfig, DifyAiConfig };
