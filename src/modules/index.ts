import { UploaderModule } from './uploader/uploader.module';
import { LlmTaskModule } from './llm-task/llm-task.module';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { DifyAiModule } from './dify-ai/dify-ai.module';
import { AuthModule } from './auth/auth.module';
import { DatasetModule } from './dataset/dataset.module';
import { YoutubeModule } from './youtube/youtube.module';
import { DocumentModule } from './document/document.module';
import { ChapterModule } from './chapter/chapter.module';

export const Modules = [
  UploaderModule,
  LlmTaskModule,
  VectorStoreModule,
  DifyAiModule,
  AuthModule,
  DatasetModule,
  YoutubeModule,
  DocumentModule,
  ChapterModule,
];
