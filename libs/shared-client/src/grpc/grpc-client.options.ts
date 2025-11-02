import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GRPC_SERVICE } from './services.constant';

// ---- User SERVICE ----
export const userGrpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    protoPath: join(
      __dirname,
      '../../libs/shared-client/src/grpc/proto/user.proto'
    ),
    package: GRPC_SERVICE.USER.PACKAGE,
    url: process.env['USER_GRPC_URL'] || '0.0.0.0:50051',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
      includeDirs: [],
    },
  },
};

// ---- Driver SERVICE ----
export const driverGrpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    protoPath: join(
      __dirname,
      '../../libs/shared-client/src/grpc/proto/driver.proto'
    ),
    package: GRPC_SERVICE.DRIVER.PACKAGE,
    url: process.env['DRIVER_GRPC_URL'] || '0.0.0.0:50052',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
      includeDirs: [],
    },
  },
};

// ---- Trip SERVICE ----
export const tripGrpcOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    protoPath: join(
      __dirname,
      '../../libs/shared-client/src/grpc/proto/trip.proto'
    ),
    package: GRPC_SERVICE.TRIP.PACKAGE,
    url: process.env['TRIP_GRPC_URL'] || '0.0.0.0:50053',
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      arrays: true,
      objects: true,
      includeDirs: [],
    },
  },
};
