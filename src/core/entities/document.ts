import { BaseEntity } from './base';
import { YoutubeEntity } from './youtube';

export class DocumentEntity extends BaseEntity {
  name: string;

  youtubeId: string;

  youtube: YoutubeEntity;

  userId: string;

  conversationId: string;

  parentMessageId: string;
}
