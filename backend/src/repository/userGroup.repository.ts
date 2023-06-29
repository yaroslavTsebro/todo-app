import {prisma} from "../utils/prismaManager";
import {UserGroup} from "@prisma/client";
import logger from "../config/logger";

class UserGroupRepository {

  async create(userId: number, groupId: number) {
    try {
      return prisma.userGroup.create({
        data: {
          userId: userId,
          groupId: groupId,
        }
      });
    } catch (e) {
      logger.info("An Error occurred during create");
      throw e;
    }
  }

  async delete(id: number): Promise<UserGroup | null> {
    try {
      return prisma.userGroup.delete({where: {id: id}});
    } catch (e) {
      logger.info("An Error occurred during delete");
      throw e;
    }
  }

  async checkForPresence(groupId: number, userId: number): Promise<boolean> {
    try {
      const userGroup = await prisma.userGroup.findFirst(
          {where: {groupId: groupId, userId: userId}});
      return userGroup !== null;
    } catch (e) {
      logger.info("An Error occurred during checkForPresence");
      throw e;
    }
  }

  async getByUserIdAndGroupId(
      groupId: number, userId: number): Promise<UserGroup | null> {
    try {
      return prisma.userGroup.findFirst(
          {where: {groupId: groupId, userId: userId}});
    } catch (e) {
      logger.info("An Error occurred during checkForPresence");
      throw e;
    }
  }
}

export default new UserGroupRepository();