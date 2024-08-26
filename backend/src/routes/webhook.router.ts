import { gmailWebhook, outlookWebhook } from "controllers/webhook.controller";
import { Router } from "express";
import { verifyGmailWebhook, verifyOutlookWebhook } from "middlewares/webhook.middleware";
import { validateRequestBody } from "validators/requestValidator";
import { z } from 'zod';

const webhookRouter = Router();

const gmailPayloadWebhook = z.object({
    emailId: z.string(),
    accountId: z.string(),
});
export type IGmailPayloadWebhook = z.infer<typeof gmailPayloadWebhook>;
webhookRouter.post('/gmail', validateRequestBody(gmailPayloadWebhook), verifyGmailWebhook(), gmailWebhook);

webhookRouter.post('/outlook', verifyOutlookWebhook(), outlookWebhook);

export default webhookRouter;
