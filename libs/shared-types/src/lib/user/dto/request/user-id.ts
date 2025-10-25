import { IsNotEmpty } from "class-validator";

export class UserId {

  @IsNotEmpty()
  id!: string;
}
