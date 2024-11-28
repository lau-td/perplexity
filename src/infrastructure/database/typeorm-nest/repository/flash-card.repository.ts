import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { FlashCardEntity } from 'src/core/entities';
import { IFlashCardRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { FlashCard } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class FlashCardRepository
  extends GenericRepository<FlashCard, FlashCardEntity>(FlashCard)
  implements IFlashCardRepository
{
  constructor(
    @InjectRepository(FlashCard)
    public readonly repository: Repository<FlashCard>,
  ) {
    const toDomainEntity = (typeOrmEntity: FlashCard): FlashCardEntity => {
      return plainToInstance(FlashCardEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
