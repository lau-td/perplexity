import { UserEntity } from '../entities';

import { IGenericRepository } from './generic-repository.interface';

export type IUserRepository = IGenericRepository<UserEntity>;
