import { IsNotEmpty } from "class-validator";


export class GetDriverRequest {
  @IsNotEmpty()
  userId!: string;
}
