import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './config/env-config.module';
import { SecurityModule } from './security/security.module';
import { DbModule } from './config/db.module';

@Module({
  imports: [ EnvConfigModule, SecurityModule, DbModule ],
  controllers: [ AppController ],
  providers: [AppService],
})
export class AppModule {}
