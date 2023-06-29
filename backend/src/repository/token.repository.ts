import {Token} from "@prisma/client";
import {prisma} from "../utils/prismaManager";
import logger from "../config/logger";

class TokenRepository {

  async findByUserId(id: number): Promise<Token | null> {
    try {
      return prisma.token.findUnique({where: {userId: id}});
    } catch (e) {
      logger.info('An error occurred during findByUserId');
      throw e;
    }
  }

  async findByToken(token: string): Promise<Token | null> {
    try {
      return prisma.token.findUnique({where: {token: token}});
    } catch (e) {
      logger.info('An error occurred during findByToken');
      throw e;
    }
  }

  async update(id: number, token: string): Promise<Token> {
    try {
      return await prisma.token.update(
          {where: {userId: id}, data: {token: token}});
    } catch (e) {
      logger.info('An error occurred during update');
      throw e;
    }
  }

  async create(userId: number, token: string): Promise<Token | null> {
    try {
      return prisma.token.create({
        data: {
          userId: userId,
          token: token
        }
      })
    } catch (e) {
      logger.info('An error occurred during create');
      throw e;
    }
  }

  async delete(token: string): Promise<Token> {
    try {
      return prisma.token.delete({
        where: {
          token: token
        }
      });
    } catch (e) {
      logger.info('An error occurred during delete');
      throw e;
    }
  }
}

export default new TokenRepository();