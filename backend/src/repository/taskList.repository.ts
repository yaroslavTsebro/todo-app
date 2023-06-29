import {prisma} from "../utils/prismaManager";
import {ForType, RepeatType, TaskList} from "@prisma/client";
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
import {AppError} from "../model/error/AppError";
import {ErrorCodes} from "../constant/ErrorCodes";
import {ErrorMessages} from "../constant/ErrorMessages";

class TaskListRepository {

  async createFor(dto: TaskListGroupCreateWithTasksDto | TaskListUserCreateWithTasksDto) {
    try {
      let data;
      if (dto instanceof TaskListGroupCreateWithTasksDto) {
        data = {
          userId: dto.userId,
          repeatType: dto.repeatType,
          groupId: dto.groupId,
          forType: ForType.GROUP,
        }
      } else {
        data = {
          userId: dto.userId,
          repeatType: dto.repeatType,
          forType: ForType.USER,
        }
      }
      if (dto.repeatType === RepeatType.EVERYDAY) {
        const minDate = new Date("0001-01-01");
        minDate.setHours(dto.date.getHours());
        minDate.setMinutes(dto.date.getMinutes());
        data = {
          ...data,
          date: minDate
        } as typeof data & { date: Date };
      } else if (dto.repeatType === RepeatType.EVERY_SOME_OF_DAYS) {
        const frequency = dto.frequency.map((date) => {
          if (date.getFullYear() <= 1900) {
            return new Date("0001-01-01");
          } else {
            const minDate = new Date("0001-01-01");
            minDate.setHours(dto.date.getHours());
            minDate.setMinutes(dto.date.getMinutes());
            return minDate;
          }
        });
        data = {
          ...data,
          frequency: frequency
        } as typeof data & { frequency: Date[] };
      } else if (dto.repeatType === RepeatType.ONE_TIME) {
        data = {
          ...data,
          date: dto.date
        } as typeof data & { date: Date };
      }

      return prisma.taskList.create({data: data});
    } catch (e) {
      logger.info('An error occurred during createFor');
      throw e;
    }
  }

  async getDaily(userId: number): Promise<TaskList[]> {
    try {
      const greaterThen = new Date()
      greaterThen.setHours(0, 0, 0, 0);
      const lessThen = new Date()
      lessThen.setHours(23, 59, 59, 999);

      return await prisma.taskList.findMany({
        where: {
          userId: userId,
          OR: [
            {repeatType: 'EVERYDAY'},
            {
              repeatType: 'ONE_TIME',
              date: {
                lt: lessThen,
                gt: greaterThen,
              },
            },
            {
              repeatType: 'EVERY_SOME_OF_DAYS',
            },
          ],
        },
        include: {
          tasks: true,
        },
      });
    } catch (e) {
      logger.info('An error occurred during getDaily');
      throw e;
    }
  }

  async getTaskListsForUserByMonth(
      userId: number, month: number): Promise<TaskList[]> {
    try {
      return this.getTaskListsByMonthFor(ForType.USER, userId, month);
    } catch (e) {
      logger.info('An error occurred during getTaskListsForUserByMonth');
      throw e;
    }
  }

  async getTaskListsForGroupByMonth(
      groupId: number, month: number): Promise<TaskList[]> {
    try {
      return this.getTaskListsByMonthFor(ForType.GROUP, groupId, month);
    } catch (e) {
      logger.info('An error occurred during getTaskListsForGroupByMonth');
      throw e;
    }
  }

  async getTaskListsWithTasksById(taskListId: number): Promise<TaskList | null> {
    try {
      return prisma.taskList.findUnique({
        where: {
          id: taskListId
        },
        include: {
          tasks: true
        }
      })
    } catch (e) {
      logger.info('An error occurred during getTaskListsWithTasksById');
      throw e;
    }
  }

  async deleteTaskList(taskListId: number): Promise<TaskList> {
    try {
      return prisma.taskList.delete({where: {id: taskListId}});
    } catch (e) {
      logger.info('An error occurred during deleteTaskList');
      throw e;
    }
  }

  async getTaskListsByMonthFor(
      forType: ForType, id: number, month: number): Promise<TaskList[]> {
    try {
      const start = new Date();
      start.setMonth(month, 0);
      start.setHours(24, 0, 0, 0);
      let end = new Date();
      end.setMonth(month + 1, 0);
      end.setHours(23, 59, 59, 999);
      return prisma.taskList.findMany({
        where: {
          groupId: id,
          forType: forType,
          OR: [
            {
              repeatType: RepeatType.ONE_TIME,
              date: {
                gte: start,
                lte: end,
              },
            },
            {
              repeatType: RepeatType.EVERYDAY
            },
            {
              repeatType: RepeatType.EVERY_SOME_OF_DAYS,
            }
          ]
        }
      })
    } catch (e) {
      logger.info("An Error occurred during getTaskListsByMonthFor")
      throw e;
    }
  }

  async getById(id: number): Promise<TaskList | null> {
    try {
      return prisma.taskList.findUnique({where: {id: id}})
    } catch (e) {
      logger.info('An error occurred during getById');
      throw e;
    }
  }

  async updateTaskList(dto: TaskListUpdateDto, id: number): Promise<TaskList> {
    try {
      let data;
      if (dto.repeatType === RepeatType.EVERYDAY || dto.repeatType ===
          RepeatType.ONE_TIME) {
        if (!dto.date) throw new AppError(ErrorCodes.BAD_REQUEST,
            ErrorMessages.BAD_REQUEST, []);
        data = {
          date: dto.date,
          frequency: [],
          repeatType: dto.repeatType
        }
      } else {
        if (!dto.frequency) throw new AppError(ErrorCodes.BAD_REQUEST,
            ErrorMessages.BAD_REQUEST, []);
        const frequency = dto.frequency.map((date) => {
          if (date.getFullYear() <= 1900) {
            return new Date("0001-01-01");
          } else {
            const minDate = new Date("0001-01-01");
            minDate.setHours(dto.date.getHours());
            minDate.setMinutes(dto.date.getMinutes());
            return minDate;
          }
        });
        data = {
          date: null,
          frequency: frequency,
          repeatType: dto.repeatType
        }
      }
      return prisma.taskList.update({
        where: {
          id: id
        },
        data: data,
        include: {
          tasks: true
        }
      })
    } catch (e) {
      logger.info('An error occurred during updateTaskList');
      throw e;
    }
  }

  async getByTaskId(taskListId: number): Promise<TaskList | null> {
    try {
      return prisma.taskList.findFirst({
        where: {
          tasks: {
            some: {
              taskListId: taskListId,
            },
          },
        },
      })
    } catch (e) {
      logger.info('An error occurred during getByTaskId');
      throw e;
    }
  }
}

export default new TaskListRepository();