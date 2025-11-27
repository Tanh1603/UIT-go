import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateUserProfileRequest {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber('VN')
  phone!: string;

  @IsNumber()
  balance!: number;
}
