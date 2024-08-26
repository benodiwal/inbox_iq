import { authController } from "controllers/auth.controller";
import { Router } from "express";
import { validateRequestBody } from "validators/requestValidator";
import { z } from "zod";

const authRouter = Router();

const googleAuthPayloadSchema = z.object({
    code: z.string(),
});
export type IGoogleAuthPayloadSchema = z.infer<typeof googleAuthPayloadSchema>;
authRouter.post('/google/callback', validateRequestBody(googleAuthPayloadSchema), authController);

export default authRouter;
