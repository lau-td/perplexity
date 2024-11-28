import { BaseEntity } from './base';

export class FlashCardEntity extends BaseEntity {
  question: string;

  answer: string;

  documentId: string;
}
