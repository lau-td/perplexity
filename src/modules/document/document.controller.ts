import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetDocumentsByUserIdQuery } from './use-cases';
import { UserEntity } from 'src/core/entities';
import { CurrentUser } from 'src/common/decorators';

@Controller('documents')
export class DocumentController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getDocumentsByUserId(@CurrentUser() user: UserEntity & { userId: string }) {
    return this.queryBus.execute(
      new GetDocumentsByUserIdQuery({ userId: user.userId }),
    );
  }
}
