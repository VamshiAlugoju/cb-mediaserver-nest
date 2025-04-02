import { Controller, Get } from '@nestjs/common';
import { MediaService } from './mediaserver.service';
import { AppService } from './main.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly appService: AppService,
  ) {}

  @MessagePattern('gethello')
  getHello(): string {
    return this.mediaService.getHello();
  }

  @MessagePattern('get_instance_details')
  getInstanceDetails(): any {
    return this.appService.getInstanceDetails();
  }
  @Get()
  getthis() {
    return 'this';
  }
}
