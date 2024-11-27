import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { DocumentSegment } from './document-segment.entity';

@Entity()
export class Embedding extends BaseEntity {
  @Column({ type: 'double precision', array: true, nullable: true })
  embedding: number[];

  @Column({ type: 'uuid' })
  documentSegmentId: string;

  @OneToOne(() => DocumentSegment)
  @JoinColumn({ name: 'document_segment_id' })
  documentSegment: DocumentSegment;
}
