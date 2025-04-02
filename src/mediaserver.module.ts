import { Module } from '@nestjs/common';
import { AppController } from './mediaserver.controller';
import { MediaService } from './mediaserver.service';
import { AppService } from './main.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MediaService, AppService],
})
export class MediaserverModule {}
