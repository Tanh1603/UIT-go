import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLocationRequest {
  @IsNotEmpty()
  driverId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
