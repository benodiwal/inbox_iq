import getEnvVar from 'env/index';
import OpenAI from 'openai';
import { category, EmailContent } from 'types/email.types';

class OpenAiService {
    private client: OpenAI;
    
    constructor() {
        this.client = new OpenAI({
            apiKey: getEnvVar('OPENAI_API_KEY')
        });
    }

    async categorizeEmail(content: EmailContent): Promise<category> {
        const prompt = `
        You are an AI assistant for ReachInbox, a platform for managing cold email outreach campaigns. 
        Analyze the following email content and categorize it as 'INTERESTED', 'NOT_INTERESTED', or 'MORE_INFORMATION'.
        Consider the sender's tone, explicit statements of interest, and any questions or requests for additional information.
        Respond with only the category name.

        Email content:
        ${content.subject}
        ${content.body}
        `;

        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a highly accurate email categorization assistant. Give only the keyword as response as asked' },
                { role: 'user', content: prompt }
            ],
        });

        return completion.choices[0].message.content as category;
    }

    async generateResponse(content: EmailContent, category: category, responderName: string): Promise<string> {
        const prompt = `
        You are an AI assistant for ReachInbox, a platform for managing cold email outreach campaigns.
        Generate a personalized response to the following email, which has been categorized as ${category}.
        
        Guidelines:
        - If INTERESTED: Suggest a specific date and time for a demo call. Use a friendly, enthusiastic tone.
        - If NOT_INTERESTED: Politely acknowledge their decision and leave the door open for future contact.
        - If MORE_INFORMATION: Provide a brief overview of ReachInbox's key features and ask what specific information they need.
        
        Always maintain a professional tone and keep the response concise (2-3 paragraphs max).

        Original email:
        Subject: ${content.subject}
        Body: ${content.body}

        Respond as: ${responderName}
        `;

        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a highly effective email response generator.' },
                { role: 'user', content: prompt }
            ],
        });
        
        return completion.choices[0].message.content || 'Unable to generate response';
    }
}

const openAiService = new OpenAiService();
export default openAiService;
