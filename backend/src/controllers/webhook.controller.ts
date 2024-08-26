import { InternalServerError } from "errors/internal-server-errors";
import { NextFunction, Request, Response } from "express";
import emailProcessingService from "libs/processing.lib";
import { IGmailPayloadWebhook } from "routes/webhook.router";

export const gmailWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailId, accountId } = req.body as unknown as IGmailPayloadWebhook;
        await emailProcessingService.addEmailToQueue({ emailId, accountId, platform: 'GMAIL' });
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
