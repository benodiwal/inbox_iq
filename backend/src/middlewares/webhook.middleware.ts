import getEnvVar from "env/index"
import { NextFunction, Request, Response } from "express"
import crypto from 'crypto';

export const verifyGmailWebhook = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getEnvVar('GMAIL_WEBHOOK_SECRET');
        const hash = crypto.createHash('sha1').update(token).digest('hex');
        if (req.headers['x-goog-channel-token'] !== hash) {
            return res.sendStatus(403);
        }
        next();
    }
}

export const verifyOutlookWebhook = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getEnvVar('OUTLOOK_WEBHOOK_SECRET');
        const validationToken = req.query['validationToken'];
        if (validationToken) {
            return res.status(200).send(validationToken);
        }
        if (req.headers['authorization'] !== `Bearer ${token}`) {
            return res.sendStatus(403);
        }
        next();
    }
}
