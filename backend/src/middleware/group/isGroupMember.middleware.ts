import {NextFunction, Request, Response} from "express";
import {AppError} from "../../model/error/AppError";
import {ErrorCodes} from "../../constant/ErrorCodes";
import {ErrorMessages} from "../../constant/ErrorMessages";
import userGroupRepository from "../../repository/userGroup.repository";

export function isGroupMemberMiddleware(
    req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const groupId = Number(req.params.id);
    userGroupRepository.checkForPresence(groupId, userId)
        .then(result => {
          if (!result) {
            throw new AppError(
                ErrorCodes.FORBIDDEN,
                ErrorMessages.FORBIDDEN,
                [])
          }
          next();
        })
  } catch (e) {
    return next(
        new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            []));
  }
}