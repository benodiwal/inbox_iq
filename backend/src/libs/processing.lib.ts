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

        const connection = new Redis(getEnvVar('REDIS_URL'));
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
        const { emailId, accountId } = job.data;

        try {
            const emailAccount = await prisma.emailAccount.findUnique({ where: {id: accountId} });
            if (!emailAccount) throw new Error('Email account not found');

            const emailClient = gmailOAuthClient;
            const emailData = await emailClient.getMessage(emailAccount.accessToken, emailId);
            const category = await openAiService.categorizeEmail(emailData.body);
            const response = await openAiService.generateResponse(emailData.body, category);

            await prisma.email.create({
                data: {
                    id: emailId,
                    subject: emailData.subject,
                    content: emailData.body,
                    sender: emailData.from,
                    receivedAt: new Date(emailData.receivedDateTime),
                    category,
                    response,
                    accountId,
                }            
            });

            await emailClient.sendMessage(emailAccount.accessToken, emailData.from, `Re: ${emailData.subject}`, response);

            await prisma.email.update({
                where: { id: emailId },
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
        const topic = `projects/${getEnvVar('GOOGLE_PROJECT_ID')}/topics/${getEnvVar('GOOGLE_PUBSUB_TOPIC')}`;
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
        const topic = `projects/${getEnvVar('GOOGLE_PROJECT_ID')}/topics/${getEnvVar('GOOGLE_PUBSUB_TOPIC')}`;
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
