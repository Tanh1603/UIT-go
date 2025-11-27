import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateUserProfileRequest,
  UserProfileResponse,
} from '@uit-go/shared-types';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async create(
    profile: CreateUserProfileRequest
  ): Promise<UserProfileResponse> {
    const userProfile = await this.db.$transaction(async (transaction) => {
      return await transaction.userProfile.create({
        data: {
          ...profile,
        },
      });
    });

    return {
      ...userProfile,
      balance: userProfile.balance.toNumber(),
    };
  }

  async findOne(userId: string): Promise<UserProfileResponse> {
    const profile = await this.db.userProfile.findUnique({
      where: {
        userId,
      },
    });

    return {
      ...profile,
      balance: profile.balance.toNumber(),
    };
  }
}
