/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import {
  CreateDriverRequest,
  DriverProfileResponse,
  DriverStatusEnum,
  NearbyDriverResponse,
  NearbyQuery,
  UpdateLocationRequest,
  UpdateStatusRequest,
} from '@uit-go/shared-types';
import { DriverProfile, VehicleType } from '../../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class DriverService {
  constructor(
    private prismaService: PrismaService,
    private redisService: RedisService
  ) {}

  private mapToResponse(profile: DriverProfile): DriverProfileResponse {
    return {
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      vehicleType: profile.vehicleType,
      licensePlate: profile.licensePlate,
      licenseNumber: profile.licenseNumber,
      status: profile.status,
      rating: Number(profile.rating),
      balance: Number(profile.balance),
      lastLat: profile.lastLat,
      lastLng: profile.lastLng,
    };
  }

  // crud
  async create(driver: CreateDriverRequest): Promise<DriverProfileResponse> {
    const profile = await this.prismaService.$transaction(async (db) => {
      return await db.driverProfile.create({
        data: {
          ...driver,
          rating: 0,
          balance: 0,
          vehicleType: driver.vehicleType as unknown as VehicleType,
        },
      });
    });
    return this.mapToResponse(profile);
  }

  async findOne(id: string) {
    const profile = await this.prismaService.driverProfile.findUnique({
      where: {
        userId: id,
      },
    });

    return this.mapToResponse(profile);
  }

  async updateStatus(data: UpdateStatusRequest) {
    const profile = await this.prismaService.$transaction(async (db) => {
      const updateData: any = {
        status: data.status, // data.status is already the correct string value
      };

      if (
        data.status === DriverStatusEnum.BUSY ||
        data.status === DriverStatusEnum.OFFLINE
      ) {
        updateData.lastLat = null;
        updateData.lastLng = null;
      }

      return db.driverProfile.update({
        where: {
          userId: data.driverId,
        },
        data: updateData,
      });
    });

    return this.mapToResponse(profile);
  }

  async updateLocation(data: UpdateLocationRequest) {
    const profile = await this.prismaService.$transaction(async (db) => {
      return db.driverProfile.update({
        where: {
          userId: data.driverId,
        },
        data: {
          lastLat: data.latitude,
          lastLng: data.longitude,
        },
      });
    });

    await this.redisService.geoadd(
      'drivers',
      data.longitude,
      data.latitude,
      data.driverId
    );

    return this.mapToResponse(profile);
  }

  async searchNearbyDrivers(data: NearbyQuery): Promise<NearbyDriverResponse> {
    // Add logging and validation for debugging
    console.log(
      'searchNearbyDrivers called with data:',
      JSON.stringify(data, null, 2)
    );

    // Validate input data
    if (!data) {
      throw new Error('NearbyQuery data is required');
    }
    if (
      data.longitude === undefined ||
      data.longitude === null ||
      isNaN(data.longitude)
    ) {
      throw new Error(`Invalid longitude: ${data.longitude}`);
    }
    if (
      data.latitude === undefined ||
      data.latitude === null ||
      isNaN(data.latitude)
    ) {
      throw new Error(`Invalid latitude: ${data.latitude}`);
    }
    if (
      data.radiusKm === undefined ||
      data.radiusKm === null ||
      isNaN(data.radiusKm) ||
      data.radiusKm <= 0
    ) {
      throw new Error(`Invalid radiusKm: ${data.radiusKm}`);
    }

    // Handle count parameter defensively for gRPC compatibility
    const count = data.count && data.count > 0 ? data.count : undefined;

    const res = await this.redisService.geosearch(
      'drivers',
      data.longitude,
      data.latitude,
      data.radiusKm,
      count
    );

    return {
      list: res.map((r) => ({
        driverId: r.member,
        distance: r.distance.toString(),
      })),
    };
  }
}
