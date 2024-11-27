import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDocumentSegmentRepository,
  IEmbeddingRepository,
} from 'src/core/repository';
import { WeaviateService } from './weaviate.service';
import { EmbeddingService } from './embedding.service';
import { WhereFilter } from 'weaviate-ts-client';

@Injectable()
export class VectorStoreService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_SEGMENT_REPOSITORY)
    private readonly documentSegmentRepository: IDocumentSegmentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.EMBEDDING_REPOSITORY)
    private readonly embeddingRepository: IEmbeddingRepository,

    private readonly embeddingService: EmbeddingService,

    private readonly weaviateService: WeaviateService,
  ) {}

  async processStoreDocument(userId: string, documentId: string) {
    try {
      const collectionName = `User_${userId.replace(/-/g, '_')}`;
      const documentSegments = await this.documentSegmentRepository.find({
        documentId,
      });

      if (documentSegments.length === 0) {
        throw new Error('No document segments found');
      }

      const embeddings = await Promise.all(
        documentSegments.map((segment) =>
          this.embeddingRepository.findOne({
            documentSegmentId: segment.id,
          }),
        ),
      );

      const mergedData = documentSegments.map((segment) => {
        const embedding = embeddings.find(
          (emb) => emb.documentSegmentId === segment.id,
        );
        return {
          segment,
          embedding: embedding?.embedding || [],
        };
      });

      await this.weaviateService.createCollection(collectionName);
      await this.weaviateService.enhanceAddTexts(
        {
          texts: mergedData.map((item) => item.segment.content),
          embeddings: mergedData.map((item) => item.embedding),
          metadata: mergedData.map((item) =>
            JSON.stringify(item.segment.metadata),
          ),
        },
        collectionName,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchByQuery(userId: string, query: string, documentIds?: string[]) {
    const collectionName = `User_${userId.replace(/-/g, '_')}`;
    const filter: WhereFilter | undefined =
      documentIds && documentIds.length > 0
        ? {
            operator: 'Or',
            operands: documentIds?.map((id) => ({
              operator: 'Equal',
              path: ['metadata'],
              valueText: JSON.stringify({ documentId: id }),
            })),
          }
        : undefined;

    const embedding = await this.embeddingService.generateEmbedding(query);
    return this.weaviateService.search(embedding, collectionName, 3, filter);
  }
}
