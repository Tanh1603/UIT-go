import { DriverStatusEnum } from '../../enum/driver-status.enum';
import { VehicleTypeEnum } from '../../enum/vehicle.enum';

export class DriverProfileResponse {
  userId!: string;
  name!: string;

  email!: string;

  phone!: string;

  vehicleType!: VehicleTypeEnum;

  licensePlate!: string;

  licenseNumber!: string;

  status!: DriverStatusEnum;

  rating!: number;

  balance!: number;

  lastLat!: number | null;

  lastLng!: number | null;
}
