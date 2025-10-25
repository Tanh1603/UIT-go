import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { UserModule } from '../micro-service/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../micro-service/auth/auth.module';
import { DriverModule } from '../micro-service/driver/driver.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CLERK_SECRET_KEY: Joi.string().required(),
        USER_GRPC_URL: Joi.string().required(),
      }),
    }),

    UserModule,

    AuthModule,

    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
