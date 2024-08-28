import prisma from "apps/database";
import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";
import gmailOAuthClient from "libs/gmail.lib";
import emailProcessingService from "libs/processing.lib";

export const gmailWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = req.body.message;
        const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
        const emailAddress = data.emailAddress as string;
        const historyId = data.historyId as string;

        console.log(`Processing webhook for email: ${emailAddress}, historyId: ${historyId}`);

        const emailAccount = await prisma.emailAccount.findUnique({ where: { email: emailAddress } });
        if (!emailAccount) {
            console.log(`Email account not found for address: ${emailAddress}`);
            return res.sendStatus(404);
        }

        const latestMessages = await gmailOAuthClient.listMessages(emailAccount.accessToken, 'is:unread', 1);
        
        if (latestMessages.length === 0) {
            console.log('No new unread messages found');
            return res.sendStatus(200);
        }

        const latestMessage = latestMessages[0];
        console.log(`Latest message ID: ${latestMessage.id}`);

        const existingEmail = await prisma.email.findUnique({
            where: { id: latestMessage.id }
        });

        if (existingEmail) {
            console.log(`Message ${latestMessage.id} has already been processed`);
            return res.sendStatus(200);
        }

        const fullMessage = await gmailOAuthClient.getMessage(emailAccount.accessToken, latestMessage.id);
        
        const messageDate = new Date(parseInt(fullMessage.internalDate));
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (messageDate < fiveMinutesAgo) {
            console.log(`Message ${latestMessage.id} is older than 5 minutes, skipping`);
            return res.sendStatus(200);
        }

        console.log(`Processing latest message: ${latestMessage.id}`);
        await emailProcessingService.addEmailToQueue({
            emailId: emailAddress,
            messageId: latestMessage.id,
            platform: 'GMAIL',
        });

        await prisma.emailAccount.update({
            where: { email: emailAddress },
            data: { lastProcessedHistoryId: historyId.toString() }
        });

        console.log(`Updated lastProcessedHistoryId to ${historyId} for email: ${emailAddress}`);

        res.sendStatus(200);
    } catch (err: unknown) {
        console.error('Error in gmailWebhook:', err);
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
