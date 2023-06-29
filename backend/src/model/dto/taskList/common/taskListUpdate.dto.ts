import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional
} from "class-validator";
import {RepeatType} from "@prisma/client";
import {Transform} from "class-transformer";

export class TaskListUpdateDto {
  @IsOptional()
  @IsDate()
  date: Date;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(7)
  @ArrayMinSize(7)
  @Transform(
      ({value}) => value.map((dateString: string) => new Date(dateString)))
  @IsDate({each: true})
  frequency: (Date)[];

  @IsOptional()
  @IsEnum(RepeatType)
  repeatType: RepeatType;
}