import {IsOptional, IsString, Length, Max, Min} from "class-validator";

export class TaskUpdateDto {
  @IsString()
  @IsOptional()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsOptional()
  @Length(2, 500)
  description: string;

  @Min(5)
  @IsOptional()
  @Max(24 * 60)
  duration: number;
}