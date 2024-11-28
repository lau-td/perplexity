import { BaseEntity } from './base';
import { DatasetEntity } from './dataset';
import { DocumentEntity } from './document';

export class DatasetDocumentJoinEntity extends BaseEntity {
  datasetId: string;

  dataset: DatasetEntity;

  documentId: string;

  document: DocumentEntity;
}
