import { BaseEntity } from './base';
import { DocumentEntity } from './document';

export class DocumentSegmentEntity extends BaseEntity {
  position: number;

  content: string;

  metadata: Record<string, any>;

  documentId: string;

  document: DocumentEntity;
}
