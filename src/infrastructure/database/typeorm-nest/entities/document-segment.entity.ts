import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Document } from './document.entity';
import { Embedding } from './embedding.entity';

@Entity()
export class DocumentSegment extends BaseEntity {
  @Column({ type: 'integer' })
  position: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ type: 'uuid' })
  embeddingId: string;

  @ManyToOne(() => Embedding)
  @JoinColumn({ name: 'embedding_id' })
  embedding: Embedding;
}
