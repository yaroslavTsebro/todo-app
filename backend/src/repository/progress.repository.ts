import {prisma} from "../utils/prismaManager";
import {Progress} from "@prisma/client";
import logger from "../config/logger";

class ProgressRepository {
  async getByDayAndTaskId(
      date: Date, taskId: number): Promise<Progress | null> {
    try {
      return prisma.progress.findFirst({
        where: {
          taskId: taskId,
          date: {
            equals: date
          }
        }
      })
    } catch (e) {
      logger.info("An Error occurred in getByDayAndTaskId")
      throw e;
    }
  }

  async getById(id: number): Promise<Progress | null> {
    try {
      return prisma.progress.findFirst({
        where: {
          id: id,
        }
      })
    } catch (e) {
      logger.info("An Error occurred in getById")
      throw e;
    }
  }

  async create(date: Date, taskId: number): Promise<Progress> {
    try {
      return prisma.progress.create({
        data: {
          taskId: taskId,
          date: date,
          progress: 0,
        }
      })
    } catch (e) {
      logger.info("An Error occurred in create")
      throw e;
    }
  }

  async updateProgress(
      progressId: number, progress: number): Promise<Progress> {
    try {
      return prisma.progress.update({
        where: {
          id: progressId
        },
        data: {
          progress: progress
        }
      })
    } catch (e) {
      logger.info("An Error occurred in updateProgress")
      throw e;
    }
  }
}

export default new ProgressRepository();