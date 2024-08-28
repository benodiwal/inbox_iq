// import { Client } from '@microsoft/microsoft-graph-client';
// import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
// import { ClientSecretCredential } from '@azure/identity';
// import prisma from 'apps/database';
// import { backOff } from "exponential-backoff";
// import getEnvVar from 'env/index';

// class OutlookOAuthClient {
//   private graphClient: Client;

//   constructor() {
//     const credential = new ClientSecretCredential(
//       getEnvVar('MICROSOFT_TENANT_ID'),
//       getEnvVar('MICROSOFT_OAUTH_CLIENT_ID'),
//       getEnvVar('MICROSOFT_OAUTH_CLIENT_SECRET')
//     );

//     const authProvider = new TokenCredentialAuthenticationProvider(credential, {
//       scopes: ['https://graph.microsoft.com/.default']
//     });

//     this.graphClient = Client.initWithMiddleware({
//       authProvider: authProvider
//     });
//   }

//   async processMessagesOrDelta(userId: string, deltaLink: string | null): Promise<void> {
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) throw new Error('User not found');

//     if (deltaLink) {
//       await this.processDelta(userId, deltaLink);
//     } else {
//       await this.fetchAndProcessRecentMessages(userId);
//     }
//   }

//   private async processDelta(userId: string, deltaLink: string): Promise<void> {
//     let nextLink = deltaLink;
//     do {
//       const response: any = await this.graphClient.api(nextLink).get();
      
//       for (const message of response.value) {
//         if (message['@odata.type'] === '#microsoft.graph.message') {
//           await this.processMessage(userId, message.id);
//         }
//       }

//       nextLink = response['@odata.nextLink'];
//       if (response['@odata.deltaLink']) {
//         await this.updateDeltaLink(userId, response['@odata.deltaLink']);
//       }
//     } while (nextLink);
//   }

//   private async fetchAndProcessRecentMessages(userId: string): Promise<void> {
//     const response: any = await this.graphClient.api('/me/messages')
//       .top(10)
//       .orderby('receivedDateTime DESC')
//       .get();

//     for (const message of response.value) {
//       await this.processMessage(userId, message.id);
//     }

//     if (response['@odata.deltaLink']) {
//       await this.updateDeltaLink(userId, response['@odata.deltaLink']);
//     }
//   }

//   private async processMessage(userId: string, messageId: string): Promise<void> {
//     try {
//       const message = await this.getMessageWithRetry(messageId);
//       await this.processEmail(message, userId);
//     } catch (error) {
//       console.error(`Failed to process message ${messageId}:`, error);
//     }
//   }

//   private async getMessageWithRetry(messageId: string, maxAttempts = 5): Promise<any> {
//     return backOff(() => this.fetchMessage(messageId), {
//       numOfAttempts: maxAttempts,
//       startingDelay: 1000,
//       timeMultiple: 2,
//       retry: (e: any, attemptNumber: number) => {
//         console.log(`Attempt ${attemptNumber} to fetch message ${messageId} failed:`, e.message);
//         return e.statusCode === 404;
//       }
//     });
//   }

//   private async fetchMessage(messageId: string): Promise<any> {
//     return this.graphClient.api(`/me/messages/${messageId}`).get();
//   }

//   private async processEmail(email: any, userId: string) {
//     console.log(`Processing email ${email.id} for user ${userId}`);
//     // Implement your email processing logic here
//     // e.g., Save to database, trigger notifications, etc.
//   }

//   private async updateDeltaLink(userId: string, deltaLink: string): Promise<void> {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { outlookDeltaLink: deltaLink }
//     });
//   }

//   async createSubscription(userId: string): Promise<void> {
//     const subscription = {
//       changeType: 'created,updated',
//       notificationUrl: `${getEnvVar('WEBHOOK_BASE_URL')}/webhook/outlook`,
//       resource: '/me/mailFolders(\'Inbox\')/messages',
//       expirationDateTime: new Date(Date.now() + 4230 * 60000).toISOString(), // Expires in ~3 days
//       clientState: userId // Use this to identify the user in webhook
//     };

//     const response: any = await this.graphClient.api('/subscriptions').post(subscription);
    
//     await prisma.user.update({
//       where: { id: userId },
//       data: { outlookSubscriptionId: response.id }
//     });
//   }

//   async renewSubscription(userId: string): Promise<void> {
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user || !user.outlookSubscriptionId) throw new Error('User or subscription not found');

//     const expirationDateTime = new Date(Date.now() + 4230 * 60000).toISOString(); // Renew for ~3 days
    
//     await this.graphClient.api(`/subscriptions/${user.outlookSubscriptionId}`)
//       .patch({ expirationDateTime });
//   }
// }

// const outlookOAuthClient = new OutlookOAuthClient();
// export default outlookOAuthClient;
