import express from "express";
import { addAvatar } from "../controllers/avatarControllers.js";
import { uploadMiddleware } from "../middleware/upload.js";
const avatarRouter = express.Router();

avatarRouter.patch("/", uploadMiddleware.single("avatar"), addAvatar);

export default avatarRouter;
