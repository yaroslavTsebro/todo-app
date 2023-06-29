import {NextFunction, Request, Response} from "express";
import TaskListService from "../service/taskList.service";
import taskListService from "../service/taskList.service";
import {plainToInstance} from "class-transformer";
import {
  TaskListGroupCreateWithTasksDto
} from "../model/dto/taskList/group/taskListGroupCreateWithTasks.dto";
import {
  TaskListUpdateDto
} from "../model/dto/taskList/common/taskListUpdate.dto";
import {
  TaskListUserCreateWithTasksDto
} from "../model/dto/taskList/user/taskListUserCreateWithTasks.dto";
import logger from "../config/logger";

class TaskListController {

  public async getDaily(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("getDaily started");
      const userId = req.user.id;
      const daily = await TaskListService.getDaily(userId);

      logger.info("getDaily ended");
      res.json(daily).end();
    } catch (e) {
      next(e);
    }
  }

  public async getTaskListsForGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("getTaskListsForGroup started");
      const month = Number(req.query.m);
      const userId = req.user.id;
      const groupId = Number(req.params.id);

      const taskLists = await TaskListService.getTaskListForGroup(userId,
          groupId, month);
      logger.info("getTaskListsForGroup ended");
      res.json(taskLists).end();
    } catch (e) {
      next(e);
    }
  }

  public async getTaskListsForUser(
      req: Request, res: Response, next: NextFunction) {
    try {
      const month = Number(req.query.m);
      const userId = req.user.id;

      const taskLists = await TaskListService.getTaskListForUser(userId, month);
      res.json(taskLists).end();
    } catch (e) {
      next(e);
    }
  }

  public async createTaskListForGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskList = plainToInstance(TaskListGroupCreateWithTasksDto,
          req.body);
      taskList.groupId = Number(req.params.id);
      taskList.date = new Date(taskList.date);
      taskList.userId = req.user.id;

      const result = await TaskListService.createTaskListFor(taskList);

      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async createTaskListForUser(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskList = plainToInstance(TaskListUserCreateWithTasksDto,
          req.body);
      taskList.date = new Date(taskList.date);
      taskList.userId = req.user.id;

      const result = await TaskListService.createTaskListFor(taskList);

      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async deleteTaskListForGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.body.taskListId);
      const groupId = Number(req.body.id);

      const result = taskListService.deleteTaskListForGroup(taskListId, groupId)
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async deleteTaskListForUser(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.body.taskListId);
      const userId = req.user.id

      const result = taskListService.deleteTaskListForUser(taskListId, userId)
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateTaskListForGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.body.taskListId);
      const groupId = Number(req.body.id);
      const taskList = plainToInstance(TaskListUpdateDto, req.body);

      const result = taskListService.updateTaskList(taskListId, groupId,
          taskList)
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateTaskListForUser(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.body.taskListId);
      const taskList = plainToInstance(TaskListUpdateDto, req.body);
      const userId = req.user.id

      const result = taskListService.updateTaskListForUser(taskListId, taskList,
          userId)
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }
}

export default new TaskListController();