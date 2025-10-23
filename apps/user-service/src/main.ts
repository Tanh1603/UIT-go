import { USER_PACKAGE_NAME } from '@uit-go/shared-proto';
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(
          __dirname,
          '../../libs/shared-proto/src/protos/user-profile.proto'
        ),
        package: USER_PACKAGE_NAME,
        url: process.env.GRPC_URL,
      },
    }
  );
  await app.listen();

  Logger.log(`🚀 User Microservice is running successfully!`);
}

bootstrap();
