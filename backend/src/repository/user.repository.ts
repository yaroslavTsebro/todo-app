import {prisma} from "../utils/prismaManager";
import {PrismaPromise, User} from "@prisma/client";
import UserUpdateDto from "../model/dto/user/userUpdate.dto";
import logger from "../config/logger";
import UserProfileDto from "../model/dto/user/userProfile.dto";

class UserRepository {
  public async getUsers(): Promise<User[]> {
    try {
      return prisma.user.findMany();
    } catch (e) {
      logger.info("An Error occurred during getUsers")
      throw e;
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      return prisma.user.findUnique({
        where: {
          email: email
        }
      })
    } catch (e) {
      logger.info("An Error occurred during getUserByEmail")
      throw e;
    }

  }

  public async getUserById(id: number): Promise<User | null> {
    try {
      return prisma.user.findUnique({
        where: {
          id: id
        }
      })
    } catch (e) {
      logger.info("An Error occurred during getUserById")
      throw e;
    }
  }

  public async deleteUser(id: number): Promise<User> {
    try {
      return prisma.user.delete({
        where: {
          id: id
        }
      })
    } catch (e) {
      logger.info("An Error occurred during deleteUser")
      throw e;
    }
  }

  public createUser(dto: User): PrismaPromise<User> {
    try {
      return prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: dto.password,
        }
      })
    } catch (e) {
      logger.info("An Error occurred during createUser")
      throw e;
    }
  }

  public async updateUser(user: UserUpdateDto): Promise<User> {
    try {
      return prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          email: user.email || undefined,
          isMuted: user.isMuted || undefined,
        }
      })
    } catch (e) {
      logger.info("An Error occurred during updateUser")
      throw e;
    }
  }

  public async updateUserIsVerified(id: number): Promise<User> {
    try {
      return prisma.user.update({
        where: {
          id: id
        },
        data: {
          isVerified: true
        }
      })
    } catch (e) {
      logger.info("An Error occurred during updateUserIsVerified")
      throw e;
    }
  }

  public async checkForPresence(id: number): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({where: {id: id}});
      return !!user;
    } catch (e) {
      logger.info("An Error occurred during checkForPresence")
      throw e;
    }
  }

  public async getProfile(userId: number): Promise<UserProfileDto | null> {
    try {
      return prisma.user.findFirst({
        where: {
          id: userId
        },
        select: {
          username: true,
          email: true,
          isMuted: true,
          isVerified: true,
          createdAt: true,
        }
      });
    } catch (e) {
      logger.info("An Error occurred during getProfile")
      throw e;
    }
  }

}

export default new UserRepository();