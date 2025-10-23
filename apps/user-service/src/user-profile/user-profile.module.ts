import { PrismaService } from './../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [],
  controllers: [UserProfileController],
  providers: [UserProfileService, PrismaService],
  exports: [],
})
export class UserProfileModule {}
