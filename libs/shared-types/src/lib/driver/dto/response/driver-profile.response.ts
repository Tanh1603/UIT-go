export class DriverProfileResponse {
  userId!: string;
  name!: string;

  email!: string;

  phone!: string;

  vehicleType!: string;

  licensePlate!: string;

  licenseNumber!: string;

  status!: string;

  rating!: number;

  balance!: number;

  lastLat!: number | null;

  lastLng!: number | null;
}
