import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DatasetDocumentJoinEntity } from 'src/core/entities';
import { IDatasetDocumentJoinRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { DatasetDocumentJoin } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DatasetDocumentJoinRepository
  extends GenericRepository<DatasetDocumentJoin, DatasetDocumentJoinEntity>(
    DatasetDocumentJoin,
  )
  implements IDatasetDocumentJoinRepository
{
  constructor(
    @InjectRepository(DatasetDocumentJoin)
    public readonly repository: Repository<DatasetDocumentJoin>,
  ) {
    const toDomainEntity = (
      typeOrmEntity: DatasetDocumentJoin,
    ): DatasetDocumentJoinEntity => {
      return plainToInstance(DatasetDocumentJoinEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
