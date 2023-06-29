import {NextFunction, Request, Response} from "express";
import {AppError} from "../../model/error/AppError";
import {ErrorCodes} from "../../constant/ErrorCodes";
import {ErrorMessages} from "../../constant/ErrorMessages";
import taskListRepository from "../../repository/taskList.repository";

export function userOwnsTaskListMiddleware(
    req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const taskListId = Number(req.params.taskListId);
    taskListRepository.getByTaskId(taskListId)
        .then(taskList => {
          if (!taskList) {
            throw new AppError(
                ErrorCodes.DONT_HAVE_SUCH_TASK_LIST,
                ErrorMessages.DONT_HAVE_SUCH_TASK_LIST,
                [])
          }
          if (taskList.userId !== userId) {
            throw new AppError(
                ErrorCodes.FORBIDDEN,
                ErrorMessages.FORBIDDEN,
                [])
          }
          next();
        });
  } catch (e) {
    return next(
        new AppError(
            ErrorCodes.UNAUTHORIZED,
            ErrorMessages.UNAUTHORIZED,
            []));
  }
}