import express from "express";
import taskController from "../controller/task.controller";
import {isAdminOrOwnerMiddleware} from "../middleware/group/isAdminOrOwner.middleware";
import {isGroupMemberMiddleware} from "../middleware/group/isGroupMember.middleware";
import {userOwnsTaskListMiddleware} from "../middleware/group/userOwnsTaskList.middleware";

let router = express.Router();

router.post("/group/:id/:taskListId/:taskId/start", isGroupMemberMiddleware, taskController.startTaskFromGroup)
router.put("/group/:id/:taskListId/:taskId/:progressId/update", isGroupMemberMiddleware, taskController.updateProgress)
router.post("/group/:id/:taskListId", isAdminOrOwnerMiddleware, taskController.addTask)
router.delete("/group/:id/:taskListId/:taskId", isAdminOrOwnerMiddleware, taskController.removeTaskFromGroup)
router.put("/group/:id/:taskListId/:taskId", isAdminOrOwnerMiddleware, taskController.updateTaskFromGroup)
router.get("/group/:id/:taskListId/:taskId", isGroupMemberMiddleware, taskController.getTaskFromGroup)

router.post("/user/:taskListId/:taskId/start",userOwnsTaskListMiddleware, taskController.startTask)
router.put("/user/:taskListId/:taskId/:progressId/update",userOwnsTaskListMiddleware, taskController.updateProgress)
router.post("/user/:taskList",userOwnsTaskListMiddleware, taskController.addTask)
router.delete("/user/:taskList/:taskId",userOwnsTaskListMiddleware, taskController.removeTask)
router.put("/user/:taskList/:taskId",userOwnsTaskListMiddleware, taskController.updateTask)
router.get("/user/:taskList/:taskId",userOwnsTaskListMiddleware, taskController.getTask)

export {
    router as taskRoute
}