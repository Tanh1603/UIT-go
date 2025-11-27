import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { VehicleTypeEnum } from '../../enum/vehicle.enum';

export class CreateDriverRequest {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone!: string;

  @IsEnum(VehicleTypeEnum)
  vehicleType!: VehicleTypeEnum;

  @IsNotEmpty()
  licensePlate!: string;

  @IsNotEmpty()
  licenseNumber!: string;
}
