import { google } from 'googleapis';
import { Credentials, OAuth2Client } from 'google-auth-library';
import getEnvVar from 'env/index';

class GmailOAuthClient {
  private client: OAuth2Client;
  private gmail: any;

  constructor() {
    this.client = new OAuth2Client({
      clientId: getEnvVar('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_OAUTH_CLIENT_SECRET'),
      redirectUri: 'postmessage',
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.client });
  }

  async getTokenFromCode(code: string): Promise<Credentials> {
    try {
      const { tokens } = await this.client.getToken(code);
      this.client.setCredentials(tokens);
      return tokens;
    } catch (error: any) {
      throw new Error(`Failed to get token: ${error.message}`);
    }
  }

  async getUserProfile(accessToken: string): Promise<{
    email: string;
    name: string;
  }> {
    try {
      this.client.setCredentials({ access_token: accessToken });
      const response = await this.gmail.users.getProfile({ userId: 'me' });
      return {
        email: response.data.emailAddress,
        name: response.data.name || '',
      };
    } catch (error: any) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  async listMessages(accessToken: string, query: string = ''): Promise<any[]> {
    try {
      this.client.setCredentials({ access_token: accessToken });
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
      });
      return response.data.messages || [];
    } catch (error: any) {
      throw new Error(`Failed to list messages: ${error.message}`);
    }
  }

  async getMessage(accessToken: string, messageId: string): Promise<any> {
    try {
      this.client.setCredentials({ access_token: accessToken });
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get message: ${error.message}`);
    }
  }

  async sendMessage(accessToken: string, to: string, subject: string, body: string): Promise<string> {
    try {
      this.client.setCredentials({ access_token: accessToken });
      const message = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        `To: ${to}\n`,
        `Subject: ${subject}\n\n`,
        body
      ].join('');

      const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const res = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return res.data.id;
    } catch (error: any) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}

const gmailOAuthClient = new GmailOAuthClient();
export default gmailOAuthClient;
