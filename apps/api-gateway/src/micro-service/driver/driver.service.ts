import clerkClient from '@clerk/clerk-sdk-node';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DriverServiceClient, GRPC_SERVICE } from '@uit-go/shared-client';
import {
  NearbyQuery,
  UpdateLocationRequest,
  UpdateStatusRequest,
} from '@uit-go/shared-types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DriverService {
  private driverService: DriverServiceClient;

  constructor(
    @Inject(GRPC_SERVICE.DRIVER.NAME) private driverClient: ClientGrpc
  ) {
    this.driverService = this.driverClient.getService<DriverServiceClient>(
      GRPC_SERVICE.DRIVER.NAME
    );
  }

  async findOne(id: string) {
    const clerk = await clerkClient.users.getUser(id);

    const profile = await firstValueFrom(
      this.driverService.getDriver({ userId: id })
    );

    return {
      userId: clerk.id,
      username: clerk.username,
      ...profile,
    };
  }

  async updateStatus(data: UpdateStatusRequest) {
    return firstValueFrom(this.driverService.updateStatus(data));
  }

  async updateLocation(data: UpdateLocationRequest) {
    return firstValueFrom(this.driverService.updateLocation(data));
  }

  async searchNearBy(data: NearbyQuery) {
    return firstValueFrom(this.driverService.searchNearbyDrivers(data));
  }
}
