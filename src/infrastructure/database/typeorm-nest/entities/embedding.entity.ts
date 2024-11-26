import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class Embedding extends BaseEntity {
  @Column({ type: 'double precision', nullable: true })
  embedding: number[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  content: string;
}
