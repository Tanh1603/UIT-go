import { IsEnum, IsNotEmpty } from 'class-validator';
import { DriverStatusEnum } from '../../enum';

export class UpdateStatusRequest {
  @IsNotEmpty()
  driverId!: string;

  @IsEnum(DriverStatusEnum)
  status!: DriverStatusEnum;
}
