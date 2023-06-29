import {IsNumber, IsPositive} from "class-validator";

export class TaskListUserDeleteDto {
  @IsPositive()
  @IsNumber()
  id: number;

  @IsPositive()
  @IsNumber()
  userId: number;
}