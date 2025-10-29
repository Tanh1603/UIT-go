import { tripGrpcOptions } from '@uit-go/shared-client';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,

    {
      ...tripGrpcOptions,
    }
  );
  await app.listen();

  Logger.log(`🚀 Trip Microservice is running successfully!`);
}

bootstrap();
