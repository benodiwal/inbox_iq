import prisma from "apps/database";
import getEnvVar from "env/index";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";
import googleOAuthClient from "libs/auth.lib";
import gmailOAuthClient from "libs/gmail.lib";
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

export const gmailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body as unknown as IGoogleAuthPayloadSchema;
        const userId = req.session.currentUserId as string;
        const tokens = await gmailOAuthClient.getTokenFromCode(code);
        const response = await gmailOAuthClient.getUserProfile(tokens.access_token as string);
        
        const historyId = await gmailOAuthClient.watchMailBox(tokens.access_token as string, getEnvVar('GOOGLE_PUBSUB_TOPIC'));

        const account = await prisma.emailAccount.findUnique({ where: { email: response.email } });
        if (account) {
            await prisma.emailAccount.update({
                where: { id: account.id },
                data: {
                    accessToken: tokens.access_token as string,
                    refreshToken: tokens.refresh_token as string,
                    lastProcessedHistoryId: historyId,
                }
            });

            return res.sendStatus(200);
        }

        await prisma.emailAccount.create({
            data: {
                accessToken: tokens.access_token as string,
                refreshToken: tokens.refresh_token as string,
                platform: 'GMAIL',
                user: {
                    connect: { id: userId }
                },
                email: response.email,
                lastProcessedHistoryId: historyId,
            }
        });

        res.sendStatus(200);

    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}
