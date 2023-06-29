import {ServiceHelper} from "./serviceHelper";
import taskListRepository from "../repository/taskList.repository";
import TaskListRepository from "../repository/taskList.repository";
import {TaskList} from "@prisma/client";
import {AppError} from "../model/error/AppError";
import {ErrorCodes} from "../constant/ErrorCodes";
import {ErrorMessages} from "../constant/ErrorMessages";
import UserGroupRepository from "../repository/userGroup.repository";
import {
  TaskListGroupCreateWithTasksDto
} from "../model/dto/taskList/group/taskListGroupCreateWithTasks.dto";
import TaskRepository from "../repository/task.repository";
import {
  TaskListUpdateDto
} from "../model/dto/taskList/common/taskListUpdate.dto";
import {
  TaskListUserCreateWithTasksDto
} from "../model/dto/taskList/user/taskListUserCreateWithTasks.dto";

class TaskListService extends ServiceHelper {

  async getDaily(id: number) {
    try {
      return taskListRepository.getDaily(id);
    } catch (e) {
      throw e;
    }
  }

  async createTaskListFor(taskList: TaskListGroupCreateWithTasksDto | TaskListUserCreateWithTasksDto) {
    TaskListService.validateInput(taskList);

    const createdTaskList = await TaskListRepository.createFor(taskList);
    if (taskList.tasks) {
      await TaskRepository.createManyForTaskList(taskList.tasks,
          createdTaskList.id);
    }

    const result = await TaskListRepository.getTaskListsWithTasksById(
        createdTaskList.id);
    if (result) {
      return result;
    } else {
      throw new AppError(
          ErrorCodes.SERVER_ERROR,
          ErrorMessages.SERVER_ERROR,
          [])
    }
  }

  async getTaskListForGroup(
      userId: number, groupId: number, month: number): Promise<TaskList[]> {
    try {
      if (month < 0 || month > 11) {
        throw new AppError(
            ErrorCodes.BAD_REQUEST,
            ErrorMessages.BAD_REQUEST,
            [])
      }
      TaskListService.validateId(userId);
      TaskListService.validateId(groupId);

      const link = await UserGroupRepository.checkForPresence(groupId, userId);
      if (!link) {
        throw new AppError(
            ErrorCodes.FORBIDDEN,
            ErrorMessages.FORBIDDEN,
            [])
      }

      return await TaskListRepository.getTaskListsForGroupByMonth(groupId,
          month);
    } catch (e) {
      throw e;
    }
  }

  async getTaskListForUser(userId: number, month: number): Promise<TaskList[]> {
    if (month < 1 || month > 12) {
      throw new AppError(
          ErrorCodes.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST,
          [])
    }
    TaskListService.validateId(userId);

    return await TaskListRepository.getTaskListsForUserByMonth(userId, month);
  }

  async deleteTaskListForGroup(taskListId: number, groupId: number) {
    TaskListService.validateId(taskListId);
    TaskListService.validateId(groupId);

    await this.checkTaskForGroup(taskListId, groupId);
    return TaskListRepository.deleteTaskList(taskListId);
  }

  async deleteTaskListForUser(taskListId: number, userId: number) {
    TaskListService.validateId(taskListId);
    TaskListService.validateId(userId);

    await this.checkTaskForUser(taskListId, userId);
    return TaskListRepository.deleteTaskList(taskListId);
  }

  async updateTaskList(
      taskListId: number, groupId: number, dto: TaskListUpdateDto) {
    TaskListService.validateId(taskListId);
    TaskListService.validateInput(dto);
    TaskListService.validateId(groupId);

    await this.checkTaskForGroup(taskListId, groupId);

    return TaskListRepository.updateTaskList(dto, taskListId);
  }

  async updateTaskListForUser(
      taskListId: number, dto: TaskListUpdateDto, userId: number) {
    TaskListService.validateId(taskListId);
    TaskListService.validateId(userId);
    TaskListService.validateInput(dto);

    await this.checkTaskForUser(taskListId, userId);
    return TaskListRepository.updateTaskList(dto, taskListId);
  }

  async checkTaskForGroup(taskListId: number, groupId: number) {
    const taskList = await TaskListRepository.getById(taskListId);
    if (!taskList) {
      throw new AppError(
          ErrorCodes.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST,
          []);
    }
    if (taskList.groupId !== groupId) {
      throw new AppError(
          ErrorCodes.FORBIDDEN,
          ErrorMessages.FORBIDDEN,
          []);
    }
  }

  async checkTaskForUser(taskListId: number, userId: number) {
    const taskList = await TaskListRepository.getById(taskListId);
    if (!taskList) {
      throw new AppError(
          ErrorCodes.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST,
          []);
    }
    if (taskList.userId !== userId) {
      throw new AppError(
          ErrorCodes.FORBIDDEN,
          ErrorMessages.FORBIDDEN,
          []);
    }
  }
}

export default new TaskListService();
