import {IsNumber, IsPositive, IsString, Length} from "class-validator";

export class GroupJoinDto {

  @IsNumber()
  @IsPositive()
  userId: number;

  @Length(2, 50)
  @IsString()
  link: string;

}