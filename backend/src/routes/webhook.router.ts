import { gmailWebhook, outlookWebhook } from "controllers/webhook.controller";
import { Router } from "express";
import { z } from 'zod';

const webhookRouter = Router();

const gmailPayloadWebhook = z.object({
    emailId: z.string(),
    historyId: z.string(),
});
export type IGmailPayloadWebhook = z.infer<typeof gmailPayloadWebhook>;
webhookRouter.post('/gmail', gmailWebhook);
webhookRouter.post('/outlook', outlookWebhook);

export default webhookRouter;
