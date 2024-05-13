import express from "express";
import { register, login, logout } from "../controllers/authControllers.js";
import { authCheck } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", authCheck, logout);

export default authRouter;
