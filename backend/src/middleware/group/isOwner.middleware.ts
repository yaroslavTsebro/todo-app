import {NextFunction, Request, Response} from "express";
import groupRepository from "../../repository/group.repository";
import {AppError} from "../../model/error/AppError";
import {ErrorCodes} from "../../constant/ErrorCodes";
import {ErrorMessages} from "../../constant/ErrorMessages";

export function isOwnerMiddleware(
    req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const groupId = Number(req.params.id);
    groupRepository.checkOwnerForPresence(userId, groupId)
        .then(group => {
          if (!group) {
            return next(
                new AppError(
                    ErrorCodes.FORBIDDEN,
                    ErrorMessages.FORBIDDEN,
                    []));
          }
        });

    next();
  } catch (e) {
    return next(
        new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            []));
  }
}