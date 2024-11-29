import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DocumentController } from './document.controller';
import { GetDocumentsByUserIdQueryHandler } from './use-cases';

const Handlers = [GetDocumentsByUserIdQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [DocumentController],
  providers: [...Handlers],
})
export class DocumentModule {}
