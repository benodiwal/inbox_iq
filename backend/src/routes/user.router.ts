import { logout, me } from "controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get('/', me);
userRouter.get('/logout', logout);

export default userRouter;
