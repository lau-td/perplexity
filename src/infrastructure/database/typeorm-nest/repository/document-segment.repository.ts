import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DocumentSegmentEntity } from 'src/core/entities';
import { IDocumentSegmentRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { DocumentSegment } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DocumentSegmentRepository
  extends GenericRepository<DocumentSegment, DocumentSegmentEntity>(
    DocumentSegment,
  )
  implements IDocumentSegmentRepository
{
  constructor(
    @InjectRepository(DocumentSegment)
    public readonly repository: Repository<DocumentSegment>,
  ) {
    const toDomainEntity = (
      typeOrmEntity: DocumentSegment,
    ): DocumentSegmentEntity => {
      return plainToInstance(DocumentSegmentEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
