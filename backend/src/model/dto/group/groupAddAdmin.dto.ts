import {IsNumber, IsPositive} from "class-validator";

export class GroupAddAdminDto {

  @IsNumber()
  @IsPositive()
  ownerId: number;

  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  groupId: number;
}