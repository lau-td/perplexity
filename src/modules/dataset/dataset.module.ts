import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatasetController } from './dataset.controller';
import {
  CreateDatasetCommandHandler,
  UpdateDatasetCommandHandler,
  DeleteDatasetCommandHandler,
  GetDatasetQueryHandler,
  GetDatasetsQueryHandler,
  CreateDatasetDocumentJoinCommandHandler,
  DeleteDatasetDocumentJoinCommandHandler,
} from './use-cases';

const Handlers = [
  CreateDatasetCommandHandler,
  UpdateDatasetCommandHandler,
  DeleteDatasetCommandHandler,
  GetDatasetQueryHandler,
  GetDatasetsQueryHandler,
  CreateDatasetDocumentJoinCommandHandler,
  DeleteDatasetDocumentJoinCommandHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [DatasetController],
  providers: [...Handlers],
})
export class DatasetModule {}
