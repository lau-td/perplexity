import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Youtube } from './youtube.entity';
import { User } from './user.entity';

@Entity()
export class Document extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'uuid' })
  youtubeId: string;

  @ManyToOne(() => Youtube)
  @JoinColumn({ name: 'youtube_id' })
  youtube: Youtube;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  conversationId: string;

  @Column({ type: 'varchar', nullable: true })
  parentMessageId: string;
}
