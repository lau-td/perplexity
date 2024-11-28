import { BaseEntity } from './base';
import { DocumentEntity } from './document';

export class FlashCardEntity extends BaseEntity {
  question: string;

  answer: string;

  explanation: string;

  documentId: string;

  document: DocumentEntity;
}
