import {NextFunction, Request, Response} from "express";
import taskService from "../service/task.service";
import {
  TaskCreateWithTaskListDto
} from "../model/dto/task/taskCreateWithTaskList.dto";
import {plainToInstance} from "class-transformer";
import {TaskUpdateDto} from "../model/dto/task/taskUpdate.dto";

class TaskController {
  public async startTaskFromGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskListId = Number(req.params.taskList);
      const taskId = Number(req.params.taskId);

      const result = await taskService.startTaskFromGroup(userId, taskListId,
          taskId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async removeTaskFromGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.params.taskListId);
      const taskId = Number(req.params.taskId);
      const groupId = Number(req.params.groupId);

      const result = await taskService.removeTaskFromGroup(taskListId, taskId,
          groupId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateTaskFromGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.params.taskListId);
      const taskId = Number(req.params.taskId);
      const groupId = Number(req.params.groupId);
      const dto = plainToInstance(TaskUpdateDto, req.body);

      const result = await taskService.updateTaskFromGroup(taskListId, taskId,
          groupId, dto);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async getTaskFromGroup(
      req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.taskId);

      const result = await taskService.getTaskFromGroupById(taskId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async startTask(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskListId = Number(req.params.taskList);
      const taskId = Number(req.params.taskId);

      const result = await taskService.startTask(userId, taskListId, taskId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const taskListId = Number(req.params.taskListId);
      const taskId = Number(req.params.taskId);
      const progressId = Number(req.params.progressId);
      const progress = Number(req.body.progress);

      const result = await taskService.updateProgress(userId, taskListId,
          taskId, progressId, progress);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async addTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.params.taskList);
      const dto = plainToInstance(TaskCreateWithTaskListDto, req.body);

      const result = await taskService.addTask(dto, taskListId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async removeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.params.taskListId);
      const taskId = Number(req.params.taskId);
      const userId = req.user.id;

      const result = await taskService.remove(taskListId, taskId, userId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskListId = Number(req.params.taskListId);
      const taskId = Number(req.params.taskId);
      const userId = req.user.id;
      const dto = plainToInstance(TaskUpdateDto, req.body);

      const result = await taskService.updateTask(taskListId, taskId, userId,
          dto);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }

  public async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.taskId);

      const result = await taskService.getTaskFromGroupById(taskId);
      res.json(result).end();
    } catch (e) {
      next(e);
    }
  }
}

export default new TaskController();

