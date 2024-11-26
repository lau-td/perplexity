import { join } from 'path';

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { CONFIG_KEY } from '../../config-key';

import { NamingStrategy } from './naming.strategy';

import * as dotenv from 'dotenv';

dotenv.config();

export default registerAs<TypeOrmModuleOptions>(CONFIG_KEY.DATABASE, () => ({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST ?? 'localhost',
  port: parseInt(process.env.POSTGRES_DB_PORT ?? '55433', 10),
  username: process.env.POSTGRES_DB_USERNAME ?? 'postgres',
  password: process.env.POSTGRES_DB_PASSWORD ?? 'postgres',
  database: process.env.POSTGRES_DB_NAME ?? 'perplexity',
  entities: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'infrastructure',
      'database',
      'typeorm-nest',
      'entities',
      '*.entity{.ts,.js}',
    ),
  ],
  namingStrategy: new NamingStrategy(),
  synchronize: false,
  migrationsTableName: '__migrations',
  migrations: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'infrastructure',
      'database',
      'typeorm-nest',
      'migrations',
      '*.ts',
    ),
  ],
}));
