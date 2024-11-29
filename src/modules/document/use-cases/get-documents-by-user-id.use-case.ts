import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  GetDocumentsByUserIdInputDto,
  GetDocumentsByUserIdResponseDto,
} from '../dtos';
import { Inject } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDocumentRepository } from 'src/core/repository';

export class GetDocumentsByUserIdQuery implements IQuery {
  constructor(public readonly input: GetDocumentsByUserIdInputDto) {}
}

@QueryHandler(GetDocumentsByUserIdQuery)
export class GetDocumentsByUserIdQueryHandler
  implements
    IQueryHandler<GetDocumentsByUserIdQuery, GetDocumentsByUserIdResponseDto[]>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(
    query: GetDocumentsByUserIdQuery,
  ): Promise<GetDocumentsByUserIdResponseDto[]> {
    const { userId } = query.input;

    const documents = await this.documentRepository.find({
      userId,
    });

    return documents.map((document) => ({
      id: document.id,
      name: document.name,
      youtubeId: document.youtubeId,
      conversationId: document.conversationId,
      parentMessageId: document.parentMessageId,
    }));
  }
}
