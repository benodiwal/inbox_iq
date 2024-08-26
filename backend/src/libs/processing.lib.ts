import { Queue, Worker } from 'bullmq';
import getEnvVar from 'env/index';
import Redis from 'ioredis';
import { EmailJob } from 'types/email.types';

class EmailProcessingService {
    private emailQueue: Queue<EmailJob>;
    private emailWorker: Worker<EmailJob>;

    constructor() {
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
        async () => {},
        { connection }
        );
    }
}

const emailProcessingService = new EmailProcessingService();
export default emailProcessingService;
