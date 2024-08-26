import getEnvVar from 'env/index';
import OpenAI from 'openai';
import { category } from 'types/email.types';

class OpenAi {
    client: OpenAI;
    
    constructor() {
        this.client = new OpenAI({
            apiKey: getEnvVar('OPENAI_API_KEY')
        });
    }

    async categorizeEmail(content: string): Promise<category> {
        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'assistant', content: 'You are am AI assistant that categorized emails.' },
                { role: 'user', content: `Categorize this email as 'INTERESTED', 'NOT_INTERESTED', or 'MORE_INFORMATION': ${content}` }
            ],
        });

        return completion.choices[0].message.content as category;
    }

    async generateResponse(content: string, category: category): Promise<string> {
           const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an AI assistant that generates email responses.' },
                { role: 'user', content: `Generate a response for this email categorized as ${category}. If 'Interested', suggest a demo call time: ${content}` } 
             ],
        });
        
        return completion.choices[0].message.content || 'Unable to generate response';
    }
}

const openAiService = new OpenAi();
export default openAiService;
