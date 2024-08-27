import prisma from "apps/database";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";
import googleOAuthClient from "libs/auth.lib";
import { IGoogleAuthPayloadSchema } from "routes/auth.router"

export const authController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body as unknown as IGoogleAuthPayloadSchema;        
        const payload = await googleOAuthClient.getTokenAndVerifyFromCode(code);
        
        const existingUser = await prisma.user.findFirst({
            where: {
                sub: payload.sub
            }
        });

        if (existingUser) {
            req.session.currentUserId = existingUser.id;
            return res.sendStatus(200);
        }

        const newUser = await prisma.user.create({
            data: {
                email: payload.email as string,
                name: payload.name as string,
                sub: payload.sub,
                avatar_url: payload.picture as string,
            }
        });

        req.session.currentUserId = newUser.id;
        res.sendStatus(200);

    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}
