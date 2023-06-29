import {prisma} from "../utils/prismaManager";
import {Otp} from "@prisma/client";

class OtpRepository {
  async findByCode(otp: string): Promise<Otp | null> {
    try {
      return prisma.otp.findUnique({where: {otp: otp}})
    } catch (e) {
      throw e;
    }
  }

  async findByUserId(userId: number): Promise<Otp | null>;
  async findByUserId(userId: number, prismaClient: any): Promise<Otp | null>;
  async findByUserId(userId: number, prismaClient?: any): Promise<Otp | null> {
    try {
      if (prismaClient) {
        return prismaClient.otp.findUnique({where: {userId: userId}});
      }
      return prisma.otp.findUnique({where: {userId: userId}});
    } catch (e) {
      throw e;
    }
  }

  async deleteById(id: number): Promise<Otp>;
  async deleteById(id: number, prismaClient: any): Promise<Otp>;
  async deleteById(id: number, prismaClient?: any): Promise<Otp> {
    try {
      if (prismaClient) {
        return prismaClient.otp.delete({where: {id: id}});
      }
      return prisma.otp.delete({where: {id: id}});
    } catch (e) {
      throw e;
    }
  }

  async createOtp(userId: number, otp: string): Promise<Otp>;
  async createOtp(userId: number, otp: string, prismaClient: any): Promise<Otp>;
  async createOtp(
      userId: number, otp: string, prismaClient?: any): Promise<Otp> {
    try {
      if (prismaClient) {
        return prismaClient.otp.create({data: {userId: userId, otp: otp}})
      }
      return prisma.otp.create({data: {userId: userId, otp: otp}})
    } catch (e) {
      throw e;
    }
  }
}

export default new OtpRepository();