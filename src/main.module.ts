import { Module } from '@nestjs/common';

import { Modules } from './modules';
import { Infrastructures } from './infrastructure';
import { ConfigsModule } from './config/configs.module';

@Module({
  imports: [...Modules, ...Infrastructures, ConfigsModule],
})
export class MainModule {}
