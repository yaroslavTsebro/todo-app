import {prisma} from "../utils/prismaManager";
import {Group} from "@prisma/client";
import {GroupCreateDto} from "../model/dto/group/groupCreate.dto";
import {GroupAddAdminDto} from "../model/dto/group/groupAddAdmin.dto";
import logger from "../config/logger";

class GroupRepository {

  async getById(id: number): Promise<Group | null> {
    try {
      return prisma.group.findFirst({where: {id: id}});
    } catch (e) {
      logger.info("An Error occurred during getById");
      throw e;
    }
  }

  async checkForPresence(id: number): Promise<boolean> {
    try {
      const group = await prisma.group.findFirst({where: {id: id}});
      return group !== null;
    } catch (e) {
      logger.info("An Error occurred during checkForPresence");
      throw e;
    }
  }

  async getAll(pageNumber: number): Promise<Group[]> {
    try {
      const pageSize = 10;

      return prisma.group.findMany({
        skip: pageSize * (pageNumber - 1),
        take: pageSize,
      });
    } catch (e) {
      logger.info("An Error occurred during getAll");
      throw e;
    }
  }

  async create(
      dto: GroupCreateDto, userId: number, link: string): Promise<Group> {
    try {
      return prisma.group.create({
        data: {
          name: dto.name,
          ownerId: userId,
          inviteLink: link
        }
      });
    } catch (e) {
      logger.info("An Error occurred during create");
      throw e;
    }
  }

  async addAdmin(dto: GroupAddAdminDto): Promise<Group> {
    try {
      return prisma.group.update({
        where: {
          id: dto.groupId
        },
        data: {
          adminsIds: {
            push: dto.userId
          }
        }
      });
    } catch (e) {
      logger.info("An Error occurred during addAdmin");
      throw e;
    }
  }

  async checkAdminForPresence(
      userId: number, groupId: number): Promise<boolean> {
    try {
      const group = prisma.group.findFirst({
        where: {
          id: groupId,
          adminsIds: {
            has: userId
          }
        }
      });
      return !!group;
    } catch (e) {
      logger.info("An Error occurred during checkAdminForPresence");
      throw e;
    }
  }

  async checkAdminOrOwnerForPresence(
      userId: number, groupId: number): Promise<boolean> {
    try {
      const group = await prisma.group.findFirst({
        where: {
          id: groupId,
          OR: [
            {
              adminsIds: {
                has: userId
              }
            },
            {
              ownerId: userId
            }
          ]

        }
      });
      return !!group;
    } catch (e) {
      logger.info("An Error occurred during checkAdminOrOwnerForPresence");
      throw e;
    }
  }

  async checkOwnerForPresence(
      userId: number, groupId: number): Promise<boolean> {
    try {
      const group = await prisma.group.findFirst({
        where: {
          id: groupId,
          ownerId: userId

        }
      });
      return !!group;
    } catch (e) {
      logger.info("An Error occurred during checkOwnerForPresence");
      throw e;
    }
  }

  async delete(id: number): Promise<Group> {
    try {
      return prisma.group.delete({
        where: {
          id: id
        }
      });
    } catch (e) {
      logger.info("An Error occurred during delete");
      throw e;
    }
  }

  async getByLink(link: string): Promise<Group | null> {
    try {
      return prisma.group.findUnique({where: {inviteLink: link}});
    } catch (e) {
      logger.info("An Error occurred during getByLink");
      throw e;
    }
  }

  async deleteAdmin(id: number, adminsIds: number[]): Promise<Group | null> {
    try {
      return prisma.group.update({
        where: {
          id: id
        },
        data: {
          adminsIds: adminsIds
        }
      });
    } catch (e) {
      logger.info("An Error occurred during deleteAdmin");
      throw e;
    }
  }
}

export default new GroupRepository();
