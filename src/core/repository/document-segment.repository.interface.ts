import { DocumentSegmentEntity } from '../entities';

import { IGenericRepository } from './generic-repository.interface';

export type IDocumentSegmentRepository =
  IGenericRepository<DocumentSegmentEntity>;
