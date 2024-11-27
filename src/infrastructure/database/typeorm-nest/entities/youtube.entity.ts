import { Column, Entity } from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity()
export class Youtube extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  videoId: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'jsonb' })
  metadata: any;
}
