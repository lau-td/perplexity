import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmNestDatabaseConfig } from 'src/config';
import {
  DocumentSegment,
  Embedding,
  Document,
  Youtube,
  FlashCard,
  User,
} from './entities';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';

import {
  DocumentRepository,
  DocumentSegmentRepository,
  EmbeddingRepository,
  FlashCardRepository,
  UserRepository,
  YoutubeRepository,
} from './repository';

const Adapters = [
  {
    provide: REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY,
    useClass: YoutubeRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.EMBEDDING_REPOSITORY,
    useClass: EmbeddingRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DOCUMENT_SEGMENT_REPOSITORY,
    useClass: DocumentSegmentRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.FLASH_CARD_REPOSITORY,
    useClass: FlashCardRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY,
    useClass: DocumentRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY,
    useClass: UserRepository,
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
    TypeOrmModule.forFeature([
      Youtube,
      Document,
      DocumentSegment,
      Embedding,
      FlashCard,
      User,
    ]),
  ],
  providers: [...Adapters],
  exports: [...Adapters, TypeOrmModule],
})
export class TypeOrmNestDatabaseModule {}
