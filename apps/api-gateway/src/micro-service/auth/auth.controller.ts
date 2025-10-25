import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VehicleTypeEnum } from '@uit-go/shared-types';
import { Public } from '../../common/decorator/public.decorator';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  @Public()
  registerUser(
    @Body()
    user: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      phone: string;
      balance: number;
    }
  ) {
    return this.authService.registerUser(user);
  }

  @Post('register/driver')
  @Public()
  registerDriver(
    @Body()
    user: {
      username: string;
      email: string;
      password: string;
      name: string;
      phone: string;
      vehicleType: VehicleTypeEnum;
      licensePlate: string;
      licenseNumber: string;
    }
  ) {
    return this.authService.registerDriver(user);
  }
}
