import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICE, userGrpcOptions } from '@uit-go/shared-client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GRPC_SERVICE.USER.NAME,
        useFactory: async () => {
          return {
            ...userGrpcOptions,
          };
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
