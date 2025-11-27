/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { driverGrpcOptions } from '@uit-go/shared-client';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      ...driverGrpcOptions,
    }
  );
  await app.listen();

  Logger.log(`🚀 Driver Microservice is running successfully!`);
}

bootstrap();
