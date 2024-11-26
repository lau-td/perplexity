import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmNestDatabaseConfig } from 'src/config';
import { Youtube } from './entities';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';

import { YoutubeRepository } from './repository';

const Adapters = [
  {
    provide: REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY,
    useClass: YoutubeRepository,
  },
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmNestDatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof TypeOrmNestDatabaseConfig>) =>
        config,
    }),
    TypeOrmModule.forFeature([Youtube]),
  ],
  providers: [...Adapters],
  exports: [...Adapters, TypeOrmModule],
})
export class TypeOrmNestDatabaseModule {}
