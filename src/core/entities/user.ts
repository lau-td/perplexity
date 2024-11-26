import { BaseEntity } from './base';

export class UserEntity extends BaseEntity {
  email: string;

  password: string;
}
