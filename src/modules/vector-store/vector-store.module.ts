import { Module } from '@nestjs/common';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';
import { WeaviateService } from './weaviate.service';
import { VectorStoreController } from './vector-store.controller';
import { VectorStoreService } from './vector-store.service';

@Module({
  controllers: [VectorStoreController],
  providers: [
    ChunkingService,
    EmbeddingService,
    WeaviateService,
    VectorStoreService,
  ],
  exports: [
    ChunkingService,
    EmbeddingService,
    WeaviateService,
    VectorStoreService,
  ],
})
export class VectorStoreModule {}
