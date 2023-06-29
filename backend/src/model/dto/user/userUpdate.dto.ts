import 'reflect-metadata';
import {
  IsEmail,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import {ErrorMessages} from "../../../constant/ErrorMessages";

export default class UserUpdateDto {
  @IsPositive({message: ErrorMessages.ID_IS_NEGATIVE})
  id: number;

  @IsString({message: ErrorMessages.EMAIL_MUST_BE_STRING})
  @IsEmail({}, {message: ErrorMessages.EMAIL_MUST_BE_EMAIL})
  @MinLength(3, {message: ErrorMessages.EMAIL_IS_TOO_SHORT + 3})
  @MaxLength(50, {message: ErrorMessages.EMAIL_IS_TOO_LONG + 50})
  @IsOptional()
  email?: string | null;
  @IsOptional()
  isMuted?: boolean | null;

  constructor(id: number) {
    this.id = id;
  }
}