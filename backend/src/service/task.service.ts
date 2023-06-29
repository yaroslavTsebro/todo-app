import {ServiceHelper} from "./serviceHelper";
import TaskRepository from "../repository/task.repository";
import {AppError} from "../model/error/AppError";
import {ErrorCodes} from "../constant/ErrorCodes";
import {ErrorMessages} from "../constant/ErrorMessages";
import TaskListRepository from "../repository/taskList.repository";
import ProgressRepository from "../repository/progress.repository";
import {
  TaskCreateWithTaskListDto
} from "../model/dto/task/taskCreateWithTaskList.dto";
import {TaskUpdateDto} from "../model/dto/task/taskUpdate.dto";

class TaskService extends ServiceHelper {

  async checkTaskListForPresence(taskListId: number) {
    const taskList = await TaskListRepository.getById(taskListId);
    if (taskList) {
      return taskList;
    }
    throw new AppError(
        ErrorCodes.DONT_HAVE_SUCH_TASK_LIST,
        ErrorMessages.DONT_HAVE_SUCH_TASK_LIST,
        [])
  }

  async checkTaskListForGroup(taskListId: number, groupId: number) {
    const taskList = await this.checkTaskListForPresence(taskListId);
    if (taskList.groupId !== groupId) {
      throw new AppError(
          ErrorCodes.FORBIDDEN,
          ErrorMessages.FORBIDDEN,
          [])
    }
  }

  async checkTaskListForUser(taskListId: number, userId: number) {
    const taskList = await this.checkTaskListForPresence(taskListId);
    if (taskList.userId !== userId) {
      throw new AppError(
          ErrorCodes.FORBIDDEN,
          ErrorMessages.FORBIDDEN,
          [])
    }
  }

  async checkTaskForPresence(taskId: number) {
    const task = await TaskRepository.getById(taskId);
    if (task) {
      return task;
    }
    throw new AppError(
        ErrorCodes.DONT_HAVE_SUCH_TASK_LIST,
        ErrorMessages.DONT_HAVE_SUCH_TASK_LIST,
        [])
  }

  async checkTaskForTaskListPresence(taskId: number, taskListId: number) {
    const task = await this.checkTaskForPresence(taskId);
    if (task.taskListId !== taskListId) {
      throw new AppError(
          ErrorCodes.FORBIDDEN,
          ErrorMessages.FORBIDDEN,
          [])
    }
  }

  async checkTaskListAndTaskForPresence(taskListId: number, taskId: number) {
    const taskList = await this.checkTaskListForPresence(taskListId);
    const task = await this.checkTaskForPresence(taskListId);
    return {taskList, task};
  }

  async checkTaskListAndTaskForGroup(
      taskListId: number, groupId: number, taskId: number) {
    await this.checkTaskListForGroup(taskListId, groupId);
    await this.checkTaskForTaskListPresence(taskId, taskListId);
  }

  async checkTaskListAndTaskForUser(
      taskListId: number, userId: number, taskId: number) {
    await this.checkTaskListForUser(taskListId, userId);
    await this.checkTaskForTaskListPresence(taskId, taskListId);
  }

  async startTaskFromGroup(
      groupId: number, taskListId: number, taskId: number) {
    TaskService.validateIds([groupId, taskId, taskListId])
    await this.checkTaskListAndTaskForGroup(taskListId, groupId, taskId);

    let progress = await ProgressRepository.getByDayAndTaskId(new Date(),
        taskId);
    if (progress) {
      throw new AppError(
          ErrorCodes.ALREADY_STARTED,
          ErrorMessages.ALREADY_STARTED,
          [])
    }

    progress = await ProgressRepository.create(new Date(), taskId);
    return progress;
  }

  async updateProgress(
      groupId: number, taskListId: number, taskId: number, progressId: number,
      progressAmount: number) {
    TaskService.validateIds([groupId, taskId, taskListId, progressId])
    await this.checkTaskListAndTaskForGroup(taskListId, groupId, taskId);

    let progress = await ProgressRepository.getById(progressId);
    if (!progress) {
      throw new AppError(
          ErrorCodes.DONT_HAVE_SUCH_PROGRESS,
          ErrorMessages.DONT_HAVE_SUCH_PROGRESS,
          [])
    } else if (progress.taskId !== taskId) {
      throw new AppError(ErrorCodes.FORBIDDEN, ErrorMessages.FORBIDDEN, [])
    }

    progress = await ProgressRepository.updateProgress(progressId,
        progressAmount);
    return progress
  }

  async removeTaskFromGroup(
      taskListId: number, taskId: number, groupId: number) {
    TaskService.validateIds([groupId, taskId, taskListId]);
    await this.checkTaskListAndTaskForGroup(taskListId, groupId, taskId);

    return TaskRepository.delete(taskId);
  }

  async updateTaskFromGroup(
      taskListId: number, taskId: number, groupId: number, dto: TaskUpdateDto) {
    TaskService.validateIds([groupId, taskId, taskListId]);
    TaskService.validateInput(dto);
    await this.checkTaskListAndTaskForGroup(taskListId, groupId, taskId);

    return TaskRepository.update(taskId, dto);
  }

  async updateTask(
      taskListId: number, taskId: number, userId: number, dto: TaskUpdateDto) {
    TaskService.validateIds([userId, taskId, taskListId]);
    TaskService.validateInput(dto);
    await this.checkTaskListAndTaskForUser(taskListId, userId, taskId);

    return TaskRepository.update(taskId, dto);
  }

  async getTaskFromGroupById(taskId: number) {
    TaskService.validateId(taskId);
    return TaskRepository.getById(taskId);
  }

  async startTask(userId: number, taskListId: number, taskId: number) {
    TaskService.validateIds([userId, taskId, taskListId]);
    await this.checkTaskForTaskListPresence(taskId, taskListId);

    let progress = await ProgressRepository.getByDayAndTaskId(new Date(),
        taskId);
    if (progress) {
      throw new AppError(
          ErrorCodes.ALREADY_STARTED,
          ErrorMessages.ALREADY_STARTED,
          [])
    }

    progress = await ProgressRepository.create(new Date(), taskId);
    return progress;
  }

  async addTask(dto: TaskCreateWithTaskListDto, taskListId: number) {
    TaskService.validateInput(dto);
    TaskService.validateId(taskListId);

    await TaskRepository.createTaskForTaskList(dto, taskListId);
    return TaskListRepository.getTaskListsWithTasksById(taskListId);
  }

  async remove(taskListId: number, taskId: number, userId: number) {
    TaskService.validateIds([userId, taskId, taskListId]);
    await this.checkTaskForTaskListPresence(taskId, taskListId);

    return TaskRepository.delete(taskId);
  }
}

export default new TaskService();