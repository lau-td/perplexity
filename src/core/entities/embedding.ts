import { BaseEntity } from './base';
import { DocumentSegmentEntity } from './document-segment';

export class EmbeddingEntity extends BaseEntity {
  embedding: number[];

  documentSegmentId: string;

  documentSegment: DocumentSegmentEntity;
}
