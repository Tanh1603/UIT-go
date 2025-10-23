import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '@uit-go/shared-proto';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: USER_SERVICE_NAME,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: USER_PACKAGE_NAME,
            // protoPath: join(
            //   process.cwd(),
            //   'libs/shared-proto/src/protos/user-profile.proto'
            // ),
            protoPath: join(
              __dirname,
              '../../libs/shared-proto/src/protos/user-profile.proto'
            ),

            url: configService.get<string>('USER_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
