import { accounts, logout, me } from "controllers/user.controller";
import { Router } from "express";

const userRouter = Router();

userRouter.get('/', me);
userRouter.get('/accounts', accounts);
userRouter.get('/logout', logout);

export default userRouter;
