import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IDocumentRepository,
  IFlashCardRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import { CreateFlashCardInputDto, CreateFlashCardsResponseDto } from '../dtos';
import { OpenAIService } from '../openai.service';

export class CreateFlashCardCommand implements ICommand {
  constructor(public readonly input: CreateFlashCardInputDto) {}
}

const PROMPT_TEMPLATE = `
To complete this task, you need to create an array of flashcards from the provided transcript of a YouTube video. Each flashcard should consist of a "question" and an "answer". 

Here are the steps to follow:

1. Read through the entire transcript carefully. Understand the main points, ideas, or facts presented in the video.

2. Identify key pieces of information that can be turned into a question and answer pair. The question should be formulated in a way that the answer provides valuable information or insight about the topic discussed in the video.

3. The answer should be concise, clear, and directly related to the question. It should provide a complete and accurate response to the question.

4. You must provide the explanation for the answer. The explaination is more detail and cover all the points in the question.

5. Ensure that the flashcards cover a wide range of topics or points discussed in the video. Do not focus only on one aspect or section of the video.

6. The flashcards should be useful for someone who wants to review or learn about the topic discussed in the video. They should be able to understand the main points or ideas by going through the flashcards.

Remember, the goal is to create flashcards that can help someone understand and remember the key points or ideas discussed in the video.

# Template for the Flashcards
[
  {
    question: "question 1",
    answer: "answer 1",
    explanation: "explanation 1"
  },
  {
    question: "question 2",
    answer: "answer 2",
    explanation: "explanation 2",
  },
]
Base on the above template and instruction, here is the transcript of the YouTube video:

`;

@CommandHandler(CreateFlashCardCommand)
export class CreateFlashCardCommandHandler
  implements
    ICommandHandler<CreateFlashCardCommand, CreateFlashCardsResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.FLASH_CARD_REPOSITORY)
    private readonly flashCardRepository: IFlashCardRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    private readonly openaiService: OpenAIService,
  ) {}

  async execute(command: CreateFlashCardCommand) {
    const { input } = command;

    try {
      const document = await this.documentRepository.findOne({
        id: input.documentId,
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      const youtubeInfo = await this.youtubeRepository.findOne({
        id: document.youtubeId,
      });

      if (!youtubeInfo) {
        throw new NotFoundException('Youtube info not found');
      }

      const prompt =
        PROMPT_TEMPLATE + JSON.stringify(youtubeInfo.metadata.transcript);
      const flashCards = await this.openaiService.generateCompletion(prompt);
      const flashCardsJson = this.extractJsonContent(flashCards);

      // Parse the JSON string into an array of flash cards
      const parsedFlashCards = JSON.parse(flashCardsJson);

      // Create all flash cards in the database
      const createdFlashCards = await Promise.all(
        parsedFlashCards.map((card) =>
          this.flashCardRepository.create({
            question: card.question,
            answer: card.answer,
            explanation: card.explanation,
            documentId: input.documentId,
          }),
        ),
      );

      return {
        flashCards: createdFlashCards.map((card) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          explanation: card.explanation,
        })),
      };
    } catch (error) {
      console.error('Error creating flash cards:', error);
      throw error;
    }
  }

  extractJsonContent(input: string): string {
    const patterns = {
      withBackticks: /```json\n([\s\S]*?)```/,
      withoutBackticks: /(\{[\s\S]*\})/,
    };

    return (
      patterns.withBackticks.exec(input)?.[1]?.trim() ?? // Try with backticks first
      patterns.withoutBackticks.exec(input)?.[1]?.trim() ?? // Then without backticks
      ''
    );
  }
}
