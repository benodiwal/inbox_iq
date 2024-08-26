import { logout } from "controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get('/logout', logout);

export default userRouter;
