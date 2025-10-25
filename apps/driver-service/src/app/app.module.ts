import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriverModule } from '../driver/driver.module';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [DriverModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
