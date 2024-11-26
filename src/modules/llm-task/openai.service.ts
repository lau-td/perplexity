import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCompletion(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }
}
