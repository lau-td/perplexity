import { BaseEntity } from './base.entity';
import { Document } from './document.entity';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';

@Entity()
export class DocumentChapter extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
