import TokenRepository from "../repository/token.repository";
import {AppError} from "../model/error/AppError";
import {ErrorMessages} from "../constant/ErrorMessages";
import {Token} from "@prisma/client";
import {ErrorCodes} from "../constant/ErrorCodes";

class TokenService {

  async saveToken(userId: number, refreshToken: string): Promise<Token> {
    let token = await TokenRepository.findByUserId(userId);
    let updated;

    if (token) {
      token.token = refreshToken;
      updated = await TokenRepository.update(userId, refreshToken);
    } else {
      updated = await TokenRepository.create(userId, refreshToken);
    }
    if (!updated) {
      throw new AppError(
          ErrorCodes.SERVER_ERROR,
          ErrorMessages.SERVER_ERROR,
          []);
    }

    return updated;
  }

  async removeToken(refreshToken: string): Promise<Token> {
    try {
      return await TokenRepository.delete(refreshToken)
    } catch (e) {
      throw new AppError(
          ErrorCodes.SERVER_ERROR,
          ErrorMessages.SERVER_ERROR,
          []);
    }
  }

  async findByToken(token: string): Promise<Token> {
    try {
      const tokenInstance = await TokenRepository.findByToken(token);
      if (tokenInstance) {
        return tokenInstance;
      }
      throw new AppError(
          ErrorCodes.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST,
          []);
    } catch (e) {
      if (e instanceof AppError) {
        throw new AppError(e.code, e.message, e.errorStack);
      } else {
        throw new AppError(
            ErrorCodes.SERVER_ERROR,
            ErrorMessages.SERVER_ERROR,
            []);
      }
    }
  }

}

export default new TokenService();