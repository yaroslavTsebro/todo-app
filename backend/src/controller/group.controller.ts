import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {GroupCreateDto} from "../model/dto/group/groupCreate.dto";
import GroupService from "../service/group.service";
import {GroupDto} from "../model/dto/group/group.dto";
import {GroupJoinDto} from "../model/dto/group/groupJoin.dto";
import UserGroupService from "../service/userGroup.service";
import {GroupAddAdminDto} from "../model/dto/group/groupAddAdmin.dto";
import logger from "../config/logger";

class GroupController {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("getAll started");

      const page = Number(req.query.page);
      logger.info("Page: ", page);
      const group = await GroupService.getAll(page);

      logger.info("getAll ended");
      res.json(group).end();
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("create started");
      const dto = plainToInstance(GroupCreateDto, req.body);
      const ownerId = req.user.id;
      const group = await GroupService.create(dto, ownerId);

      logger.info("create ended");
      res.json(group).end();
    } catch (e) {
      next(e)
    }
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("join started");
      const userId = req.user.id;
      const link = req.params.link;

      const dto = plainToInstance(GroupJoinDto, {userId: userId, link: link});
      await UserGroupService.join(dto);
      logger.info("join ended");
      return res.status(200).end();
    } catch (e) {
      next(e);
    }
  }

  async leave(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("leave started");
      const userId = req.user.id;
      const groupId = Number(req.params.id);

      await UserGroupService.leave(groupId, userId);
      logger.info("leave ended");
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("delete started");
      const userId = req.user.id;
      const groupId = Number(req.params.id);
      const dto = plainToInstance(GroupDto, {id: groupId, userId: userId});

      await GroupService.delete(dto);
      logger.info("delete ended");
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  }

  async makeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("makeAdmin started");
      const ownerId = req.user.id;
      const groupId = Number(req.params.id);
      const userId = Number(req.params.userId);
      const dto = plainToInstance(GroupAddAdminDto, {ownerId, groupId, userId});

      const group = await GroupService.addAdmin(dto);
      logger.info("makeAdmin ended");
      res.json(group).end();
    } catch (e) {
      next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("getById started");
      const id = Number(req.params.id);

      const group = await GroupService.getById(id);
      logger.info("getById ended");
      res.json(group).end();
    } catch (e) {
      next(e);
    }
  }
}

export default new GroupController();