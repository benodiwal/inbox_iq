import prisma from 'apps/database';
import { Job, Queue, Worker } from 'bullmq';
import getEnvVar from 'env/index';
import Redis from 'ioredis';
import { EmailJob } from 'types/email.types';
import gmailOAuthClient from './gmail.lib';
import openAiService from './openai.lib';

class EmailProcessingService {
    private emailQueue: Queue<EmailJob>;
    private emailWorker: Worker<EmailJob>;
    private subscriptionRenewalInterval: NodeJS.Timeout;

    constructor() {
        this.subscriptionRenewalInterval = setInterval(() => this.renewAllSubscriptions(), 24*60*60*1000);
        console.log(this.subscriptionRenewalInterval);

        const connection = new Redis(getEnvVar('REDIS_URL'), {
            maxRetriesPerRequest: null,
            enableReadyCheck: false        
        });

        this.emailQueue = new Queue<EmailJob>('email-processing', {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                }
            }
        });

        this.emailWorker = new Worker<EmailJob>('email-processing',
        async (job) => await this.processEmail(job),
        { connection }
        );

        this.emailWorker.on('completed', (job) => {
            console.log(`Job ${job.id} completed`);
        });

        this.emailWorker.on('failed', (job, err) => {
            console.error(`Job ${job?.id} failed with ${err.message}`);
        });
    }

    async addEmailToQueue(emailJob: EmailJob): Promise<void> {
        await this.emailQueue.add('process-email', emailJob);
    }

    async processEmail(job: Job<EmailJob>): Promise<void> {

        // Todo: Platform
        const { emailId, messageId } = job.data;
        console.log("MessageId: ", messageId);

        const email = await prisma.email.findFirst({
            where: { messageId }
        });
        if (email) return;

        try {
            const emailAccount = await prisma.emailAccount.findUnique({ where: { email: emailId } });
            if (!emailAccount) throw new Error('Email account not found');

            const emailClient = gmailOAuthClient;

            let emailData;
            try {
                emailData = await emailClient.getMessage(emailAccount.accessToken, messageId);
            } catch (err: any) {
                if (err.message.includes('Invalid id')) {
                    console.warn(`Message with ID ${emailId} not found or no longer exists. Skipping processing.`);
                    return;
                }
                throw err; 
            }
            
            const sender = emailData.payload.headers.find((header: any) => header.name === 'From')?.value || 'Unknown Sender';
            const subject = emailData.payload.headers.find((header: any) => header.name === 'Subject')?.value || 'No Subject';
            const receivedAt = new Date(parseInt(emailData.internalDate, 10));
            
            const parts = emailData.payload.parts;
            let emailContent = '';
            if (parts) {
                parts.forEach((part: any) => {
                    if (part.body.data) {
                        const decodedData = Buffer.from(part.body.data, 'base64').toString('utf-8');
                        if (part.mimeType === 'text/html') {
                            emailContent += decodedData;
                        } else if (part.mimeType === 'text/plain' && !emailContent) {
                            emailContent = decodedData;
                        }
                    }
                })
            } else if (emailData.payload.body.data) {
                emailContent = Buffer.from(emailData.payload.body.data, 'base64').toString('utf-8');
            }

            if (emailContent.length > 16380) {
                emailContent = emailContent.substring(0, 16380) + "...";
            }

            const category = await openAiService.categorizeEmail(emailContent);
            const response = await openAiService.generateResponse(emailContent, category);

            const email = await prisma.email.create({
                data: {
                    subject,
                    content: emailContent,
                    sender,
                    receivedAt,
                    messageId,
                    category,
                    response,
                    accountId: emailAccount.id,
                }            
            });

            await emailClient.sendMessage(emailAccount.accessToken, sender, `Re: ${subject}`, response);

            await prisma.email.update({
                where: { id: email.id },
                data: { responseStatus: 'SENT' }
            });

        } catch (err: unknown) {
            console.error(`Error processing email ${emailId}: `, err);
            throw err;
        }
    }

    public async setupSubscription(accountId: string): Promise<void> {
        try {
            const account = await prisma.emailAccount.findUnique({ where: { id: accountId } });
            if (!account) throw new Error('Email account not found');

            if (account.platform === 'GMAIL') {
                await this.setupGmailSubscription(account);
            } else if (account.platform === 'OUTLOOK') {
                await this.setupOutlookSubscription(account);
            }
        } catch (error) {
            console.error(`Error setting up subscription for account ${accountId}:`, error);
            throw error;
        }
    }

    private async setupGmailSubscription(account: any): Promise<void> {
        const topic = getEnvVar('GOOGLE_PUBSUB_TOPIC');
        await gmailOAuthClient.watchMailBox(account.accessToken, topic);
    }

    private async setupOutlookSubscription(account: any): Promise<void> {
        console.log(account);
    //     const subscriptionId = await outlookOAuthClient.createSubscription(account.accessToken);
    //     await prisma.emailAccount.update({
    //         where: { id: account.id },
    //         data: { outlookSubscriptionId: subscriptionId }
    //     });
    }
    
    private async renewAllSubscriptions(): Promise<void> {
        const accounts = await prisma.emailAccount.findMany();
        for (const account of accounts) {
            try {
                if (account.platform === 'GMAIL') {
                    await this.renewGmailSubscription(account);
                } else if (account.platform === 'OUTLOOK') {
                    await this.renewOutlookSubscription(account);
                }
                console.log(`Renewed subscription for account ${account.id}`);
            } catch (error) {
                console.error(`Failed to renew subscription for account ${account.id}:`, error);
            }
        }
    }

    private async renewGmailSubscription(account: any): Promise<void> {
        const topic = getEnvVar('GOOGLE_PUBSUB_TOPIC');
        await gmailOAuthClient.renewWatchMailbox(account.accessToken, topic);
    }

    private async renewOutlookSubscription(account: any): Promise<void> {
        if (account.outlookSubscriptionId) {
            // await outlookOAuthClient.renewSubscription(account.accessToken, account.outlookSubscriptionId);
        } else {
            // If for some reason the subscription ID is missing, create a new subscription
            // const subscriptionId = await outlookOAuthClient.createSubscription(account.accessToken);
            // await prisma.emailAccount.update({
                // where: { id: account.id },
                // data: { outlookSubscriptionId: subscriptionId }
            // });
    }
    }
}

const emailProcessingService = new EmailProcessingService();
export default emailProcessingService;
