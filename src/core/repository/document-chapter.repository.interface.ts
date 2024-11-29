import { DocumentChapterEntity } from '../entities';

import { IGenericRepository } from './generic-repository.interface';

export type IDocumentChapterRepository =
  IGenericRepository<DocumentChapterEntity>;
