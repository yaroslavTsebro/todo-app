import express from "express";
import groupController from "../controller/group.controller";
import {isOwnerMiddleware} from "../middleware/group/isOwner.middleware";

const router = express.Router();

router.get("/", groupController.getAll);
router.post("/", groupController.create);
router.post("/join/:link", groupController.join);
router.post("/:id/leave", groupController.leave);
router.delete("/:id", isOwnerMiddleware, groupController.delete);
router.post("/:id/:userId", isOwnerMiddleware, groupController.makeAdmin);
router.get("/:id", groupController.getById);

export {
  router as groupRoute
};