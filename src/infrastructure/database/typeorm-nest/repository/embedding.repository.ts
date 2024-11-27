import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { EmbeddingEntity } from 'src/core/entities';
import { IEmbeddingRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { Embedding } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class EmbeddingRepository
  extends GenericRepository<Embedding, EmbeddingEntity>(Embedding)
  implements IEmbeddingRepository
{
  constructor(
    @InjectRepository(Embedding)
    public readonly repository: Repository<Embedding>,
  ) {
    const toDomainEntity = (typeOrmEntity: Embedding): EmbeddingEntity => {
      return plainToInstance(EmbeddingEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
