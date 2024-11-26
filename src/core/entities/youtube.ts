import { BaseEntity } from './base';

export class YoutubeEntity extends BaseEntity {
  name: string;

  url: string;

  videoId: string;

  metadata: any;
}
