import { BaseEntity } from './base';
import { UserEntity } from './user';

export class DatasetEntity extends BaseEntity {
  name: string;

  description: string;

  userId: string;

  user: UserEntity;
}
