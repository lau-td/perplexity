import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntityWithoutId } from './base.entity';
import { Document } from './document.entity';
import { Dataset } from './dataset.entity';

@Entity()
export class DatasetDocumentJoin extends BaseEntityWithoutId {
  @PrimaryColumn({ type: 'uuid' })
  datasetId: string;

  @ManyToOne(() => Dataset)
  @JoinColumn({ name: 'dataset_id' })
  dataset: Dataset;

  @PrimaryColumn({ type: 'uuid' })
  documentId: string;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
