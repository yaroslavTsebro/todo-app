import {UserCreateDto} from "../model/dto/user/userCreate.dto";
import {AppError} from "../model/error/AppError";
import {ErrorMessages} from "../constant/ErrorMessages";
import {Otp, Token, User} from '@prisma/client';
import bcrypt from "bcrypt";
import userRepository from "../repository/user.repository";
import {instanceToPlain, plainToInstance} from "class-transformer";
import Jwt from "../utils/jwt";
import TokenService from "./token.service";
import {UserLoginDto} from "../model/dto/user/userLogin.dto";
import {ServiceHelper} from "./serviceHelper";
import {JwtPayload} from "jsonwebtoken";
import OtpRepository from "../repository/otp.repository";
import otpRepository from "../repository/otp.repository";
import {UserSelectDto} from "../model/dto/user/userSelect.dto";
import {ErrorCodes} from "../constant/ErrorCodes";
import {TokenDto} from "../model/dto/token/token.dto";
import * as uuid from 'uuid';
import {Mailer} from "../utils/mailer";
import UserProfileDto from "../model/dto/user/userProfile.dto";

type TokenResponse = Promise<{
  accessToken: string,
  refreshToken: string,
  user: TokenDto
}>;

class UserService extends ServiceHelper {

  public async registration(dto: UserCreateDto): TokenResponse {
    try {
      UserService.validateInput(dto);

      const currentUser = await userRepository.getUserByEmail(dto.email);

      if (currentUser) {
        throw new AppError(
            ErrorCodes.ALREADY_HAVE_AN_ACC,
            ErrorMessages.ALREADY_HAVE_AN_ACC,
            []);
      }

      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);

      let user = <User>instanceToPlain(dto);

      const createdUser = await userRepository.createUser(user);
      let tokenDto = new TokenDto(createdUser.id, createdUser.email,
          createdUser.isVerified);

      await this.createAndSendOtp(createdUser.id, createdUser.email);

      const tokens = Jwt.generateTokens(tokenDto);
      await TokenService.saveToken(createdUser.id, tokens.refreshToken);
      return {...tokens, user: tokenDto};
    } catch (e) {
      throw e;
    }
  }

  public async login(dto: UserLoginDto): TokenResponse {
    try {
      UserService.validateInput(dto);

      const currentUser = await userRepository.getUserByEmail(dto.email);

      if (!currentUser) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_ACC,
            ErrorMessages.DONT_HAVE_SUCH_ACC,
            []);
      }

      const result = bcrypt.compareSync(dto.password, currentUser.password);
      if (!result) {
        throw new AppError(
            ErrorCodes.WRONG_PASS,
            ErrorMessages.WRONG_PASS,
            []);
      }

      const tokenDto = new TokenDto(currentUser.id, currentUser.email,
          currentUser.isVerified);

      const tokens = Jwt.generateTokens(tokenDto);
      await TokenService.saveToken(currentUser.id, tokens.refreshToken);
      return {...tokens, user: tokenDto};
    } catch (e) {
      throw e;
    }
  }

  public async logout(token: string): Promise<Token> {
    try {
      return TokenService.removeToken(token);
    } catch (e) {
      throw e;
    }
  }

  public async createOtp(userId: number): Promise<Otp> {
    try {
      const otp = await otpRepository.findByUserId(userId);
      if (otp) {
        await otpRepository.deleteById(otp.id);
      }
      const otpCode = uuid.v4();
      return OtpRepository.createOtp(userId, otpCode);
    } catch (e) {
      throw e;
    }
  }

  public async sendOtp(otp: Otp, email: string): Promise<void> {
    try {
      let mailer = new Mailer();
      mailer.sendActivationLink(email, otp.otp);
    } catch (e) {
      throw e;
    }
  }

  public async createAndSendOtp(userId: number): Promise<void>;
  public async createAndSendOtp(userId: number, email: string): Promise<void>;
  public async createAndSendOtp(userId: number, email?: string): Promise<void> {
    try {
      if (!email) {
        let user = await userRepository.getUserById(userId);
        if (!user) {
          throw new AppError(
              ErrorCodes.DONT_HAVE_SUCH_ACC,
              ErrorMessages.DONT_HAVE_SUCH_ACC,
              [])
        }
        const otp = await this.createOtp(userId);
        await this.sendOtp(otp, user.email);
      } else {
        const otp = await this.createOtp(userId);
        await this.sendOtp(otp, email);
      }
    } catch (e) {
      throw e;
    }
  }

  public async refresh(token: string): TokenResponse {
    try {
      if (!token) {
        throw new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            [])
      }

      const userData = Jwt.validateRefreshToken(token)
      const tokenFromDB = await TokenService.findByToken(token);
      if (!userData || !tokenFromDB) {
        throw new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            [])
      }

      const user = await userRepository.getUserById(
          (userData as JwtPayload).id);

      if (!user) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_ACC,
            ErrorMessages.DONT_HAVE_SUCH_ACC,
            []);
      }

      const dto = new TokenDto(user.id, user.email, user.isVerified);
      const tokens = Jwt.generateTokens(dto);
      await TokenService.saveToken(dto.id, tokens.refreshToken);

      return {...tokens, user: dto}
    } catch (e) {
      throw e;
    }
  }

  public async activate(activateLink: string) {
    try {
      let otp = await OtpRepository.findByCode(activateLink);
      if (!otp) {
        throw new AppError(
            ErrorCodes.CODE_NOT_FOUND,
            ErrorMessages.CODE_NOT_FOUND,
            []);
      }

      let endDate = new Date(
          otp.createdAt.getTime() + new Date(otp.expireDate * 1000).getTime())
      if (endDate > new Date()) {
        await userRepository.updateUserIsVerified(otp.userId);
      } else {
        throw new AppError(
            ErrorCodes.EXPIRED_VERIFICATION_CODE,
            ErrorMessages.EXPIRED_VERIFICATION_CODE,
            []);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getAll() {
    try {
      let result = await userRepository.getUsers();
      if (result) {
        return plainToInstance(UserSelectDto, result);
      } else {
        return [];
      }
    } catch (e) {
      throw e;
    }
  }

  public async getProfile(userId: number): Promise<UserProfileDto> {
    try {
      let profile = await userRepository.getProfile(userId);
      if (profile) {
        return profile
      } else {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_ACC,
            ErrorMessages.DONT_HAVE_SUCH_ACC,
            []);
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();