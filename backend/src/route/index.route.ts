import express from "express";
import {userRouter} from "./user.route";
import {groupRoute} from "./group.route";
import {taskListRoute} from "./taskList.route";
import {authorizationMiddleware} from "../middleware/authorization.middleware";

let router = express.Router();

router.use('/user', userRouter);
router.use('/task', authorizationMiddleware, taskListRoute);
router.use('/group', authorizationMiddleware, groupRoute);

export {
  router as mainRouter
}