import express from "express";
import taskListController from "../controller/taskList.controller";
import {taskRoute} from "./task.route";
import {
  isAdminOrOwnerMiddleware
} from "../middleware/group/isAdminOrOwner.middleware";

let router = express.Router();

router.use("/", taskRoute);

router.get('/daily', taskListController.getDaily)

router.get('/group/:id', taskListController.getTaskListsForGroup);
router.post('/group/:id', isAdminOrOwnerMiddleware, taskListController.createTaskListForGroup);
router.delete('/group/:id/:taskListId', isAdminOrOwnerMiddleware, taskListController.deleteTaskListForGroup);
router.put('/group/:id/:taskList/update', isAdminOrOwnerMiddleware, taskListController.updateTaskListForGroup);

router.get('/user', taskListController.getTaskListsForUser);
router.post('/user', taskListController.createTaskListForUser);
router.delete('/user/:taskList', taskListController.deleteTaskListForUser);
router.put('/user/:taskList/update', taskListController.updateTaskListForUser);

export {
  router as taskListRoute
}