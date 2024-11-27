import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class EmbeddingService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generates embeddings for a given text using OpenAI's API
   * @param text The text to generate embeddings for
   * @returns Promise containing the embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Generates embeddings for multiple texts in batch
   * @param texts Array of texts to generate embeddings for
   * @returns Promise containing array of embedding vectors
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts,
      });

      return response.data.map((item) => item.embedding);
    } catch (error) {
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }
}
