import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatasetController } from './dataset.controller';
import {
  CreateDatasetCommandHandler,
  UpdateDatasetCommandHandler,
  DeleteDatasetCommandHandler,
  GetDatasetQueryHandler,
  GetDatasetsQueryHandler,
} from './use-cases';

const Handlers = [
  CreateDatasetCommandHandler,
  UpdateDatasetCommandHandler,
  DeleteDatasetCommandHandler,
  GetDatasetQueryHandler,
  GetDatasetsQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [DatasetController],
  providers: [...Handlers],
})
export class DatasetModule {}
