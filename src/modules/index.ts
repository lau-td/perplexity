import { UploaderModule } from './uploader/uploader.module';
import { LlmTaskModule } from './llm-task/llm-task.module';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { DifyAiModule } from './dify-ai/dify-ai.module';
import { AuthModule } from './auth/auth.module';
import { DatasetModule } from './dataset/dataset.module';
import { DatasetDocumentJoinModule } from './dataset-document-join/dataset-document-join.module';
export const Modules = [
  UploaderModule,
  LlmTaskModule,
  VectorStoreModule,
  DifyAiModule,
  AuthModule,
  DatasetModule,
  DatasetDocumentJoinModule,
];
