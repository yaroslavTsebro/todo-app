import {NextFunction, Request, Response} from "express";
import {AppError} from "../model/error/AppError";
import {ErrorMessages} from "../constant/ErrorMessages";
import Jwt from "../utils/jwt";
import {ErrorCodes} from "../constant/ErrorCodes";
import {JwtPayload} from "jsonwebtoken";
import logger from "../config/logger";

export function authorizationMiddleware(
    req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(
          new AppError(
              ErrorCodes.UNAUTHORIZED,
              ErrorMessages.UNAUTHORIZED,
              []));
    }
    const accessToken: string | undefined = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(
          new AppError(
              ErrorCodes.UNAUTHORIZED,
              ErrorMessages.UNAUTHORIZED,
              []));
    }

    const userData = Jwt.validateAccessToken(accessToken)
    if (!userData) {
      return next(
          new AppError(
              ErrorCodes.UNAUTHORIZED,
              ErrorMessages.UNAUTHORIZED,
              []));
    }
    req.user = userData as JwtPayload;

    logger.info("Authorization went good");
    next();
  } catch (e) {
    return next(
        new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            []));
  }
}