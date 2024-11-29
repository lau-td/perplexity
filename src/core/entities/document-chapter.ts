import { DocumentEntity } from 'src/core/entities';
import { BaseEntity } from './base';

export class DocumentChapterEntity extends BaseEntity {
  title: string;

  content: string;

  subtitle: string;

  documentId: string;

  document: DocumentEntity;

  position: number;
}
