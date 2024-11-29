import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { DocumentChapterEntity } from 'src/core/entities';
import { IDocumentChapterRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { DocumentChapter } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DocumentChapterRepository
  extends GenericRepository<DocumentChapter, DocumentChapterEntity>(
    DocumentChapter,
  )
  implements IDocumentChapterRepository
{
  constructor(
    @InjectRepository(DocumentChapter)
    public readonly repository: Repository<DocumentChapter>,
  ) {
    const toDomainEntity = (
      typeOrmEntity: DocumentChapter,
    ): DocumentChapterEntity => {
      return plainToInstance(DocumentChapterEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
