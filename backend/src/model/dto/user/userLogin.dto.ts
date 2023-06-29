import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ErrorMessages} from "../../../constant/ErrorMessages";

export class UserLoginDto {
  @IsString({message: ErrorMessages.USERNAME_MUST_BE_STRING})
  @MinLength(2, {message: ErrorMessages.USERNAME_IS_TOO_SHORT + 2})
  @MaxLength(50, {message: ErrorMessages.USERNAME_IS_TOO_LONG + 50})
  password: string;

  @IsString({message: ErrorMessages.EMAIL_MUST_BE_STRING})
  @IsEmail({}, {message: ErrorMessages.EMAIL_MUST_BE_EMAIL})
  @MinLength(3, {message: ErrorMessages.EMAIL_IS_TOO_SHORT + 3})
  @MaxLength(50, {message: ErrorMessages.EMAIL_IS_TOO_LONG + 50})
  email: string;
}