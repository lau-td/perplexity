import { Module } from '@nestjs/common';

import { TypeOrmNestDatabaseModule } from './typeorm-nest/database.module';

@Module({
  imports: [TypeOrmNestDatabaseModule],
  exports: [TypeOrmNestDatabaseModule],
})
export class DatabaseModule {}
