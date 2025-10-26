import { IsNumber, IsOptional } from 'class-validator';

export class NearbyQuery {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsNumber()
  radiusKm!: number;

  @IsNumber()
  @IsOptional()
  count!: number | null;
}
