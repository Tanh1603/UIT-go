import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Trip, TripStatus } from '@prisma/client';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  async createTrip(data: { userId: string }): Promise<Trip> {
    return this.prisma.trip.create({
      data: {
        userId: data.userId,
      },
    });
  }

  async getTripById(id: string): Promise<Trip | null> {
    return this.prisma.trip.findUnique({
      where: { id },
    });
  }

  async cancelTrip(id: string): Promise<Trip> {
    return this.prisma.trip.update({
      where: { id },
      data: { status: TripStatus.CANCELED },
    });
  }

  async acceptTrip(id: string, driverId: string): Promise<Trip> {
    return this.prisma.trip.update({
      where: { id },
      data: { status: TripStatus.DRIVER_ACCEPTED, driverId },
    });
  }

  async startTrip(id: string): Promise<Trip> {
    return this.prisma.trip.update({
      where: { id },
      data: { status: TripStatus.ONGOING },
    });
  }

  async completeTrip(id: string): Promise<Trip> {
    return this.prisma.trip.update({
      where: { id },
      data: { status: TripStatus.COMPLETED },
    });
  }

  async findNearestDriver(tripId: string): Promise<string | null> {
    // In a real application, this would involve a complex geospatial query.
    // For now, we'll just return a placeholder driver ID.
    console.log(`Finding nearest driver for trip ${tripId}`);
    return 'placeholder-driver-id';
  }
}
