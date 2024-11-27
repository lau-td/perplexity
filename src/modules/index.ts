import { UploaderModule } from './uploader/uploader.module';
import { LlmTaskModule } from './llm-task/llm-task.module';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { DifyAiModule } from './dify-ai/dify-ai.module';

export const Modules = [
  UploaderModule,
  LlmTaskModule,
  VectorStoreModule,
  DifyAiModule,
];
