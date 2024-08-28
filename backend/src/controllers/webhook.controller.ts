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

        if (emailAccount.lastProcessedHistoryId && parseInt(historyId) <= parseInt(emailAccount.lastProcessedHistoryId)) {
            console.log(`History ID ${historyId} is not newer than last processed ID ${emailAccount.lastProcessedHistoryId}`);
            return res.sendStatus(200);
        }

        const history = await gmailOAuthClient.getHistoryList(emailAccount.accessToken, emailAccount.lastProcessedHistoryId as string);
        if (history.length === 0) {
            console.log('No new history items found');
            return res.sendStatus(200);
        }
        for (const historyRecord of history) {
            if (historyRecord.messagesAdded) {
                for (const addedMessage of historyRecord.messagesAdded) {
                    const messageId = addedMessage.message.id;

                    const fullMessage = await gmailOAuthClient.getMessage(emailAccount.accessToken, messageId);

                    const messageDate = new Date(parseInt(fullMessage.internalDate));
                    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

                    if (messageDate < fiveMinutesAgo) {
                        console.log(`Message ${messageId} is older than 5 minutes, skipping`);
                        continue;
                    }

                    console.log(`Replying to new message: ${messageId}`);
                    await emailProcessingService.addEmailToQueue({ emailId: emailAddress, messageId, platform: 'GMAIL' });
                }
            }
        }

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
};


export const outlookWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req);
        console.log(res);
    } catch (err: unknown) {
        console.error(err);
        next(new InternalServerError());
    }
}
