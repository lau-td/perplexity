import { DocumentEntity } from '../entities';

import { IGenericRepository } from './generic-repository.interface';

export type IDocumentRepository = IGenericRepository<DocumentEntity>;