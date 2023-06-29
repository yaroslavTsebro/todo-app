import {ServiceHelper} from "./serviceHelper";
import GroupRepository from "../repository/group.repository";
import {AppError} from "../model/error/AppError";
import {ErrorCodes} from "../constant/ErrorCodes";
import {ErrorMessages} from "../constant/ErrorMessages";
import {Group} from "@prisma/client";
import {GroupCreateDto} from "../model/dto/group/groupCreate.dto";
import * as uuid from 'uuid';
import {GroupDto} from "../model/dto/group/group.dto";
import UserRepository from "../repository/user.repository";
import {GroupAddAdminDto} from "../model/dto/group/groupAddAdmin.dto";
import UserGroupRepository from "../repository/userGroup.repository";

class GroupService extends ServiceHelper {

  async getById(id: number): Promise<Group> {
    try {
      GroupService.validateId(id);

      const group = await GroupRepository.getById(id);
      if (!group) {
        throw new AppError(
            ErrorCodes.DATA_NOT_FOUND,
            ErrorMessages.DATA_NOT_FOUND,
            []);
      }

      return group;
    } catch (e) {
      throw e;
    }
  }

  async create(dto: GroupCreateDto, userId: number) {
    try {
      GroupService.validateInput(dto);

      let link = uuid.v4();
      const group = await GroupRepository.create(dto, userId, link);

      const linking = await UserGroupRepository.create(userId, group.id)

      return group;
    } catch (e) {
      throw e;
    }
  }

  async getAll(page: number): Promise<Group[]> {
    try {
      return await GroupRepository.getAll(page);
    } catch (e) {
      throw e;
    }
  }

  async addAdmin(dto: GroupAddAdminDto) {
    try {
      GroupService.validateInput(dto);
      if (dto.ownerId === dto.userId) {
        throw new AppError(
            ErrorCodes.OWNER_IS_ALREADY_ADMIN,
            ErrorMessages.OWNER_IS_ALREADY_ADMIN,
            [])
      }

      const user = await UserRepository.checkForPresence(dto.userId);
      if (!user) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_ACC,
            ErrorMessages.DONT_HAVE_SUCH_ACC,
            [])
      }

      const group = await GroupRepository.getById(dto.groupId);
      if (!group) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_GROUP,
            ErrorMessages.DONT_HAVE_SUCH_GROUP,
            [])
      }

      if (group.ownerId !== dto.ownerId) {
        throw new AppError(
            ErrorCodes.FORBIDDEN,
            ErrorMessages.FORBIDDEN,
            [])
      }

      if (group.adminsIds.includes(dto.userId)) {
        throw new AppError(
            ErrorCodes.USER_ALREADY_IS_ADMIN,
            ErrorMessages.USER_ALREADY_IS_ADMIN,
            [])
      }

      const userGroup = await UserGroupRepository.checkForPresence(dto.groupId,
          dto.userId);

      if (!userGroup) {
        throw new AppError(
            ErrorCodes.USER_THAT_YOU_WANT_TO_ADD_IS_NOT_INVITED,
            ErrorMessages.USER_THAT_YOU_WANT_TO_ADD_IS_NOT_INVITED,
            [])
      }

      return await GroupRepository.addAdmin(dto);
    } catch (e) {
      throw e;
    }

  }

  async delete(dto: GroupDto) {
    try {
      GroupService.validateInput(dto);

      const group = await GroupRepository.getById(dto.userId);

      if (!group) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_GROUP,
            ErrorMessages.DONT_HAVE_SUCH_GROUP,
            []);
      }

      if (group.ownerId !== dto.userId) {
        throw new AppError(
            ErrorCodes.FORBIDDEN,
            ErrorMessages.FORBIDDEN,
            []);
      }

      const deleted = await GroupRepository.delete(dto.id);
      if (!deleted) {
        throw new AppError(
            ErrorCodes.SERVER_ERROR,
            ErrorMessages.SERVER_ERROR,
            []);
      }
    } catch (e) {
      throw e;
    }
  }

}

export default new GroupService();