import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICE, DriverServiceClient } from '@uit-go/shared-client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TripService implements OnModuleInit {
  private driverService: DriverServiceClient;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(GRPC_SERVICE.DRIVER.NAME) private readonly driverClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.driverService = this.driverClient.getService<DriverServiceClient>(
      GRPC_SERVICE.DRIVER.NAME
    );
  }

  async createTrip(data: { userId: string }) {
    return this.prisma.trip.create({
      data: {
        userId: data.userId,
      },
    });
  }

  async getTripById(id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
    });
  }

  async cancelTrip(id: string) {
    return this.prisma.trip.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }

  async acceptTrip(id: string, driverId: string) {
    return this.prisma.trip.update({
      where: { id },
      data: { status: 'DRIVER_ACCEPTED', driverId },
    });
  }

  async startTrip(id: string) {
    return this.prisma.trip.update({
      where: { id },
      data: { status: 'ONGOING' },
    });
  }

  async completeTrip(id: string) {
    return this.prisma.trip.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }

  async findNearestDriver(tripId: string): Promise<string | null> {
    // In a real application, this would involve communicating with the driver service
    // to find nearby available drivers using geospatial queries.
    // For now, we'll just return a placeholder driver ID.
    console.log(`Finding nearest driver for trip ${tripId}`);

    // TODO: Implement integration with driver service
    // Example: const nearbyDrivers = await this.driverService.searchNearbyDrivers(location);

    return 'placeholder-driver-id';
  }
}
