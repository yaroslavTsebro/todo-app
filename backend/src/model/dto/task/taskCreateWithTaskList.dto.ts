import {IsString, Length, Max, Min} from "class-validator";

export class TaskCreateWithTaskListDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 500)
  description: string;

  @Min(5)
  @Max(24 * 60)
  duration: number;
}