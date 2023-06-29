import {IsNumber, IsPositive} from "class-validator";

export class GroupDto {

  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  userId: number;

}