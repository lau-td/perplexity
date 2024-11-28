import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Document } from './document.entity';

@Entity()
export class FlashCard extends BaseEntity {
  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
