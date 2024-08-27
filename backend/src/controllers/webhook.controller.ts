import prisma from "apps/database";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";
import gmailOAuthClient from "libs/gmail.lib";
import emailProcessingService from "libs/processing.lib";

export const gmailWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        // const message_id = req.body.message.message_id as string;
        const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
        const emailAddress = data.emailAddress as string;
        const emailAccount = await prisma.emailAccount.findUnique({ where: { email: emailAddress } });

        const messages = await gmailOAuthClient.listMessages(emailAccount?.accessToken as string, 'is:unread');
        for (const message of messages) {
            await emailProcessingService.addEmailToQueue({ emailId: emailAddress, messageId: message.id, platform: 'GMAIL' });
        }
        
        // const historyId = data.historyId as string;
        // const h = await gmailOAuthClient.getHistoryList(emailAccount?.accessToken as string, historyId);
        // console.log(h);
        
        res.sendStatus(200);
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}

export const outlookWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req);
        console.log(res);
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}
