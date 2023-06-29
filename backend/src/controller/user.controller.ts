import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {UserCreateDto} from "../model/dto/user/userCreate.dto";
import {config} from "../config/config";
import userService from "../service/user.service";
import UserService from "../service/user.service";
import {UserLoginDto} from "../model/dto/user/userLogin.dto";
import logger from "../config/logger";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Registration started')
      const userCreateDto = plainToInstance(UserCreateDto, req.body);
      logger.info('userCreateDto:', userCreateDto);

      const userData = await userService.registration(userCreateDto)
      UserController.addRefreshTokenToCookie(res, userData.refreshToken);

      logger.info('Registration ended')
      return res.json(userData).end();
    } catch (e) {
      next(e)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Loggining started')
      const userLoginDto = plainToInstance(UserLoginDto, req.body);
      logger.info('userLoginDto:', userLoginDto);

      const userData = await userService.login(userLoginDto)
      UserController.addRefreshTokenToCookie(res, userData.refreshToken);

      logger.info('Loggining ended')
      return res.json(userData).end();
    } catch (e) {
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Logout started')
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');

      logger.info('Logout started')
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('activate started')
      const activationLink = req.params.link;
      logger.info('activationLink: ', activationLink)

      await userService.activate(activationLink);

      logger.info('activate ended')
      return res.json({"Success": true}).end();
    } catch (e) {
      next(e);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('getProfile started')

      const userId = req.user.id;
      logger.info('userId: ', userId);
      const profile = await userService.getProfile(userId);

      logger.info('getProfile ended')
      return res.json(profile);
    } catch (e) {
      next(e);
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('sendOtp started')
      const userId = req.user.id;
      logger.info('userId: ', userId);
      await userService.createAndSendOtp(userId);

      logger.info('sendOtp ended')
      return res.json({"Success": true});
    } catch (e) {
      next(e)
    }

  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('refresh started')
      const {refreshToken} = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      UserController.addRefreshTokenToCookie(res, userData.refreshToken);

      logger.info('refresh ended')
      return res.json(userData);
    } catch (e) {
      next(e)
    }

  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('getAll started')
      const result = await userService.getAll();
      logger.info('getAll ended')
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public static addRefreshTokenToCookie(res: Response, token: string) {
    res.cookie('refreshToken', token,
        {maxAge: config.jwt.refreshAge, httpOnly: true})
    logger.info('Refresh token was added to the cookie');
  }
}

export default new UserController();