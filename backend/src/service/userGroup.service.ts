import {GroupJoinDto} from "../model/dto/group/groupJoin.dto";
import {ServiceHelper} from "./serviceHelper";
import GroupRepository from "../repository/group.repository";
import {AppError} from "../model/error/AppError";
import {ErrorCodes} from "../constant/ErrorCodes";
import {ErrorMessages} from "../constant/ErrorMessages";
import UserGroupRepository from "../repository/userGroup.repository";

class UserGroupService extends ServiceHelper {

  public async join(dto: GroupJoinDto) {
    try {
      UserGroupService.validateInput(dto);

      const group = await GroupRepository.getByLink(dto.link);
      if (!group) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_GROUP,
            ErrorMessages.DONT_HAVE_SUCH_GROUP,
            [])
      }
      return await UserGroupRepository.create(dto.userId, group.id);
    } catch (e) {
      throw e;
    }
  }

  public async leave(id: number, userId: number) {
    try {
      UserGroupService.validateId(id);
      UserGroupService.validateId(userId);

      const group = await GroupRepository.getById(id);
      if (!group) {
        throw new AppError(
            ErrorCodes.DONT_HAVE_SUCH_GROUP,
            ErrorMessages.DONT_HAVE_SUCH_GROUP,
            [])
      }

      const userGroup = await UserGroupRepository.getByUserIdAndGroupId(id,
          userId);
      if (!userGroup) {
        throw new AppError(
            ErrorCodes.YOU_ARE_NOT_INVITED,
            ErrorMessages.YOU_ARE_NOT_INVITED,
            [])
      }

      if (group.adminsIds.includes(userId)) {
        await GroupRepository.deleteAdmin(id,
            group.adminsIds.filter(e => e !== userId));
      }

      return UserGroupRepository.delete(userGroup.id);
    } catch (e) {
      throw e;
    }
  }
}

export default new UserGroupService();