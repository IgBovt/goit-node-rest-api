import express from "express";
import {
  addAvatar,
  getAvatar,
  // getAvatarByName,
} from "../controllers/avatarControllers.js";
import { uploadMiddleware } from "../middleware/upload.js";
const avatarRouter = express.Router();

avatarRouter.get("/", getAvatar);
// avatarRouter.get("/:name", getAvatarByName);
avatarRouter.patch("/", uploadMiddleware.single("avatar"), addAvatar);

export default avatarRouter;
