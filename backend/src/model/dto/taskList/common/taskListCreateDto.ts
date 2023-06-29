import {RepeatType} from "@prisma/client";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive
} from "class-validator";
import {Transform} from "class-transformer";

export class TaskListCreateDto {
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

  @IsNumber()
  @IsPositive()
  userId: number;

  @IsEnum(RepeatType)
  repeatType: RepeatType;
}
