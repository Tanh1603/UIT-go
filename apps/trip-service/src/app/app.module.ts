import { Module } from '@nestjs/common';
import { TripModule } from '../trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [TripModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
