import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { driverGrpcOptions, GRPC_SERVICE } from '@uit-go/shared-client';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRPC_SERVICE.DRIVER.NAME,
        useFactory: async () => ({
          ...driverGrpcOptions,
        }),
      },
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
