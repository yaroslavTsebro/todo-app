import {prisma} from "../utils/prismaManager";
import {Task} from "@prisma/client";
import {
  TaskCreateWithTaskListDto
} from "../model/dto/task/taskCreateWithTaskList.dto";
import {TaskUpdateDto} from "../model/dto/task/taskUpdate.dto";
import logger from "../config/logger";

class TaskRepository {
  async getById(taskListId: number): Promise<Task | null> {
    try {
      return prisma.task.findUnique({where: {id: taskListId}});
    } catch (e) {
      logger.info("An Error occurred in getById")
      throw e;
    }
  }

  async createManyForTaskList(
      dtos: TaskCreateWithTaskListDto[], taskListId: number): Promise<number> {
    try {
      const tasksWithGroupId = dtos.map(task => ({
        ...task,
        taskListId: taskListId,
      }));

      const result = await prisma.task.createMany({
        data: tasksWithGroupId,
      });
      return result.count;
    } catch (e) {
      logger.info("An Error occurred in createManyForTaskList")
      throw e;
    }
  }

  async createTaskForTaskList(
      dto: TaskCreateWithTaskListDto, taskListId: number): Promise<Task> {
    try {
      return prisma.task.create({
        data: {
          name: dto.name,
          description: dto.description,
          duration: dto.duration,
          taskListId: taskListId
        }
      });
    } catch (e) {
      logger.info("An Error occurred in createTaskForTaskList")
      throw e;
    }
  }

  async delete(taskId: number): Promise<Task> {
    try {
      return prisma.task.delete({
        where: {
          id: taskId
        }
      })
    } catch (e) {
      logger.info("An Error occurred in delete")
      throw e;
    }
  }

  async update(taskId: number, dto: TaskUpdateDto): Promise<Task> {
    try {
      return prisma.task.update({
        where: {
          id: taskId
        },
        data: {
          duration: dto.duration ?? undefined,
          description: dto.description ?? undefined,
          name: dto.name ?? undefined,
        }
      })
    } catch (e) {
      logger.info("An Error occurred in update")
      throw e;
    }
  }
}

export default new TaskRepository();