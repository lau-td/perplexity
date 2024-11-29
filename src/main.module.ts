import { Module } from '@nestjs/common';

import { Modules } from './modules';
import { Infrastructures } from './infrastructure';
import { ConfigsModule } from './config/configs.module';
import { JwtAuthGuard } from './common/guards';

@Module({
  imports: [...Modules, ...Infrastructures, ConfigsModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class MainModule {}
