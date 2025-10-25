import { Injectable } from '@nestjs/common';
import {
  CreateDriverRequest,
  DriverProfileResponse,
  DriverStatusEnum,
  VehicleTypeEnum,
} from '@uit-go/shared-types';
import { DriverProfile, VehicleType } from '../../generated/prisma';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private prismaService: PrismaService) {}

  private mapToResponse(profile: DriverProfile): DriverProfileResponse {
    return {
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      vehicleType: profile.vehicleType as unknown as VehicleTypeEnum,
      licensePlate: profile.licensePlate,
      licenseNumber: profile.licenseNumber,
      status: profile.status as unknown as DriverStatusEnum,
      rating: Number(profile.rating),
      balance: Number(profile.balance),
      lastLat: profile.lastLat,
      lastLng: profile.lastLng,
    };
  }

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
}
