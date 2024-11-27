import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DocumentEntity } from 'src/core/entities';
import { IDocumentRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { Document } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DocumentRepository
  extends GenericRepository<Document, DocumentEntity>(Document)
  implements IDocumentRepository
{
  constructor(
    @InjectRepository(Document)
    public readonly repository: Repository<Document>,
  ) {
    const toDomainEntity = (typeOrmEntity: Document): DocumentEntity => {
      return plainToInstance(DocumentEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
