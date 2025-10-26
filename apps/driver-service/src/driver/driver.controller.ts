import { GRPC_SERVICE } from '@uit-go/shared-client';
import { Controller } from '@nestjs/common';
import { DriverService } from './driver.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateDriverRequest,
  GetDriverRequest,
  NearbyQuery,
  UpdateLocationRequest,
  UpdateStatusRequest,
} from '@uit-go/shared-types';

// import {
//   CreateDriverRequest,
//   GetDriverRequest,
//   UpdateLocationRequest,
//   GetLocationRequest,
//   UpdateStatusRequest,
//   SearchDriversRequest,
// } from '@uit-go/shared-proto';

@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @GrpcMethod(GRPC_SERVICE.DRIVER.NAME, GRPC_SERVICE.DRIVER.METHODS.CREATE)
  async createDriverProfile(data: CreateDriverRequest) {
    return this.driverService.create(data);
  }

  @GrpcMethod(GRPC_SERVICE.DRIVER.NAME, GRPC_SERVICE.DRIVER.METHODS.DETAIL)
  async getDriverProfile(data: GetDriverRequest) {
    return this.driverService.findOne(data.userId);
  }

  @GrpcMethod(
    GRPC_SERVICE.DRIVER.NAME,
    GRPC_SERVICE.DRIVER.METHODS.UPDATE_LOCATION
  )
  async updateLocation(data: UpdateLocationRequest) {
    return this.driverService.updateLocation(data);
  }

  @GrpcMethod(
    GRPC_SERVICE.DRIVER.NAME,
    GRPC_SERVICE.DRIVER.METHODS.UPDATE_STATUS
  )
  async updateStatus(data: UpdateStatusRequest) {
    return this.driverService.updateStatus(data);
  }

  @GrpcMethod(
    GRPC_SERVICE.DRIVER.NAME,
    GRPC_SERVICE.DRIVER.METHODS.SEARCH_NEARBY
  )
  async searchNearbyDrivers(data: NearbyQuery) {
    return this.driverService.searchNearbyDrivers(data);
  }

  // @GrpcMethod('DriverLocationService', 'GetLocation')
  // async getLocation(data: GetLocationRequest) {
  //   return this.driverService.getLocation(data);
  // }

  // @GrpcMethod('DriverLocationService', 'SearchDrivers')
  // async searchDrivers(data: SearchDriversRequest) {
  //   return this.driverService.searchDrivers(data);
  // }
}
