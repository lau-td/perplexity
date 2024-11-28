import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatasetDocumentJoinController } from './dataset-document-join.controller';
import {
  CreateDatasetDocumentJoinCommandHandler,
  DeleteDatasetDocumentJoinCommandHandler,
  GetDatasetDocumentJoinQueryHandler,
} from './use-cases';

const Handlers = [
  CreateDatasetDocumentJoinCommandHandler,
  DeleteDatasetDocumentJoinCommandHandler,
  GetDatasetDocumentJoinQueryHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [DatasetDocumentJoinController],
  providers: [...Handlers],
})
export class DatasetDocumentJoinModule {}
