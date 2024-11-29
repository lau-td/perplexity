import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDocumentChapterRepository,
  IDocumentRepository,
  IUserRepository,
} from 'src/core/repository';
import {
  GetChaptersByUserInputDto,
  GetChaptersByUserResponseDto,
} from '../dtos';

export class GetChaptersByUserQuery implements IQuery {
  constructor(public readonly input: GetChaptersByUserInputDto) {}
}

@QueryHandler(GetChaptersByUserQuery)
export class GetChaptersByUserQueryHandler
  implements
    IQueryHandler<GetChaptersByUserQuery, GetChaptersByUserResponseDto[]>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHAPTER_REPOSITORY)
    private readonly chapterRepository: IDocumentChapterRepository,
  ) {}

  async execute(query: GetChaptersByUserQuery) {
    const { userId, documentId } = query.input;

    const [user, document] = await Promise.all([
      this.userRepository.findOne({ id: userId }),
      this.documentRepository.findOne({ id: documentId }),
    ]);

    if (!user || !document) {
      throw new NotFoundException('User or document not found');
    }

    if (document.userId !== user.id) {
      throw new ForbiddenException(
        'User does not have access to this document',
      );
    }

    const chapters = await this.chapterRepository.find({
      documentId,
    });

    return chapters
      .map(({ id, title, content, position, subtitle }) => ({
        id,
        title,
        content,
        position,
        subtitle,
      }))
      .sort((a, b) => a.position - b.position);
  }
}
