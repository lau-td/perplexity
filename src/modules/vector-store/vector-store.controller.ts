import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { ProcessStoreDocumentDto } from './dtos';
import { SearchByQueryDto } from './dtos/search-by-query.dto';

@Controller('vector-store')
export class VectorStoreController {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  @HttpCode(HttpStatus.OK)
  @Post('store-document')
  async storeDocument(@Body() body: ProcessStoreDocumentDto) {
    return this.vectorStoreService.processStoreDocument(
      body.userId,
      body.documentId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('search-by-query')
  async searchByQuery(@Body() body: SearchByQueryDto) {
    return this.vectorStoreService.searchByQuery(body.userId, body.query);
  }
}
