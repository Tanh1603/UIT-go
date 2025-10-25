import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
  driverGrpcOptions,
  GRPC_SERVICE,
  userGrpcOptions,
} from '@uit-go/shared-client';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRPC_SERVICE.USER.NAME,
        imports: [ConfigModule],
        useFactory: async () => ({
          ...userGrpcOptions,
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_SERVICE.DRIVER.NAME,
        useFactory: async () => ({
          ...driverGrpcOptions,
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
