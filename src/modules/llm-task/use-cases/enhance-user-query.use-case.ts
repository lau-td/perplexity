import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { EnhanceUserQueryInputDto, EnhanceUserQueryResponseDto } from '../dtos';
import { OpenAIService } from '../openai.service';

const PROMPT_TEMPLATE = `
# Instructions for Improving User Queries

# As a professional prompt engineer, your task is to refine and improve the user query to make it more clear and understandable. Follow the steps below to complete the task:

## 1. Analyze the user query provided. Understand the context and the information the user is trying to seek.

## 2. Identify any ambiguities, redundancies, or unclear phrases in the query.

## 3. Rewrite the query in a more clear, concise, and precise manner. Ensure that the revised query still seeks the same information as the original one.

## 4. Make sure the revised query is grammatically correct and easy to understand.

## 5. The output should not contain any XML tags. It should be a plain, clear, and concise user query.

Remember, the goal is to improve the clarity of the user query without changing its original intent or meaning.

The query to improve: 
`;

export class EnhanceUserQueryCommand implements ICommand {
  constructor(public readonly input: EnhanceUserQueryInputDto) {}
}

@CommandHandler(EnhanceUserQueryCommand)
export class EnhanceUserQueryCommandHandler
  implements
    ICommandHandler<EnhanceUserQueryCommand, EnhanceUserQueryResponseDto>
{
  constructor(private readonly openaiService: OpenAIService) {}

  async execute(command: EnhanceUserQueryCommand) {
    const { input } = command;

    try {
      const prompt = `${PROMPT_TEMPLATE}${input.query}`;

      const summary = await this.openaiService.generateCompletion(prompt);

      return {
        result: summary,
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}
