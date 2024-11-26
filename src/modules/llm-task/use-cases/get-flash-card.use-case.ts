import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { Inject, NotFoundException } from '@nestjs/common';
import { IFlashCardRepository } from 'src/core/repository';
import { GetFlashCardInputDto, GetFlashCardsResponseDto } from '../dtos';

export class GetFlashCardCommand implements ICommand {
  constructor(public readonly input: GetFlashCardInputDto) {}
}

@CommandHandler(GetFlashCardCommand)
export class GetFlashCardCommandHandler
  implements ICommandHandler<GetFlashCardCommand, GetFlashCardsResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.FLASH_CARD_REPOSITORY)
    private readonly flashCardRepository: IFlashCardRepository,
  ) {}

  async execute(command: GetFlashCardCommand) {
    const { input } = command;

    try {
      const flashCards = await this.flashCardRepository.find({
        documentId: input.documentId,
      });

      if (!flashCards.length) {
        throw new NotFoundException('Flash cards not found');
      }

      return {
        flashCards: flashCards.map((flashCard) => ({
          question: flashCard.question,
          answer: flashCard.answer,
        })),
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  }
}
