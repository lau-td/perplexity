import { UploaderModule } from './uploader/uploader.module';
import { LlmTaskModule } from './llm-task/llm-task.module';
import { VectorStoreModule } from './vector-store/vector-store.module';

export const Modules = [UploaderModule, LlmTaskModule, VectorStoreModule];
