import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MediaserverModule } from './mediaserver.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaserverModule,
    {
      transport: Transport.TCP,
      options: {
        port: parseInt(process.env.PORT || '8085') || 8085,
      },
    },
  );

  await app.listen();
  console.log(
    `✅ Mediaserver Microservice is running on ${process.env.HOST || 'localhost'}:${process.env.PORT || 8085}`,
  );
}

bootstrap();
