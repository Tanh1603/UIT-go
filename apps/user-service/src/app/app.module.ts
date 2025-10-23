import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [UserProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
