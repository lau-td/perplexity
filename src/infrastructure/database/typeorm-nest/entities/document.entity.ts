import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Youtube } from './youtube.entity';

@Entity()
export class Document extends BaseEntity {
  @Column({ type: 'uuid' })
  youtubeId: string;

  @ManyToOne(() => Youtube)
  @JoinColumn({ name: 'youtube_id' })
  youtube: Youtube;
}
