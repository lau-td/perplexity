import { DatasetEntity } from '../entities';

import { IGenericRepository } from './generic-repository.interface';

export type IDatasetRepository = IGenericRepository<DatasetEntity>;
