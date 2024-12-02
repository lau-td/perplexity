import { Module } from '@nestjs/common';
import { DifyAiService } from './dify-ai.service';
import { DifyAiController } from './dify-ai.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigType } from '@nestjs/config';
import { DifyAiConfig } from 'src/config';
import { ConfigModule } from '@nestjs/config';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { LlmTaskModule } from '../llm-task/llm-task.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(DifyAiConfig)],
      useFactory: (config: ConfigType<typeof DifyAiConfig>) => ({
        baseURL: config.baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      inject: [DifyAiConfig.KEY],
    }),
    VectorStoreModule,
    LlmTaskModule,
    CqrsModule,
  ],
  controllers: [DifyAiController],
  providers: [DifyAiService],
  exports: [DifyAiService],
})
export class DifyAiModule {}
