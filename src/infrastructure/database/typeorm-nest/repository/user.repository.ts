import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/core/entities';
import { IUserRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { User } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class UserRepository
  extends GenericRepository<User, UserEntity>(User)
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {
    const toDomainEntity = (typeOrmEntity: User): UserEntity => {
      return plainToInstance(UserEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
