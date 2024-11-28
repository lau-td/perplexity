import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DatasetEntity } from 'src/core/entities';
import { IDatasetRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { Dataset } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DatasetRepository
  extends GenericRepository<Dataset, DatasetEntity>(Dataset)
  implements IDatasetRepository
{
  constructor(
    @InjectRepository(Dataset)
    public readonly repository: Repository<Dataset>,
  ) {
    const toDomainEntity = (typeOrmEntity: Dataset): DatasetEntity => {
      return plainToInstance(DatasetEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
