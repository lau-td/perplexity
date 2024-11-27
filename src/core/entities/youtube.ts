import { BaseEntity } from './base';

export class YoutubeEntity extends BaseEntity {
  name: string;

  url: string;

  summary: string;

  videoId: string;

  metadata: any;
}
