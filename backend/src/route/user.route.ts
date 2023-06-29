import express from "express";

import {authorizationMiddleware} from "../middleware/authorization.middleware";
import userController from "../controller/user.controller";

let router = express.Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', authorizationMiddleware, userController.logout);
router.post('/activate/:link', userController.activate);
router.post('/profile', authorizationMiddleware, userController.getProfile);
router.post('/send-otp', authorizationMiddleware, userController.sendOtp);
router.get('/refresh', userController.refresh);
router.get('/user', authorizationMiddleware, userController.getAll);

export {
  router as userRouter
}