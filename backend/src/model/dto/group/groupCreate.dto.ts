import {IsString, Length} from "class-validator";

export class GroupCreateDto {
  @IsString()
  @Length(2, 50)
  name: string;
}