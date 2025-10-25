import clerkClient from '@clerk/clerk-sdk-node';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DriverServiceClient, GRPC_SERVICE } from '@uit-go/shared-client';
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
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      vehicleType: profile.vehicleType,
      licensePlate: profile.licensePlate,
      licenseNumber: profile.licenseNumber,
    };
  }
}
