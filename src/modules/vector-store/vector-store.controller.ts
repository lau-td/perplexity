import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { ProcessStoreDocumentDto } from './dtos';
import { SearchByQueryDto } from './dtos/search-by-query.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthPayload } from '../auth/interfaces';

@Controller('vector-store')
export class VectorStoreController {
  constructor(private readonly vectorStoreService: VectorStoreService) {}

  @HttpCode(HttpStatus.OK)
  @Post('store-document')
  async storeDocument(
    @CurrentUser() user: AuthPayload,
    @Body() body: ProcessStoreDocumentDto,
  ) {
    return this.vectorStoreService.processStoreDocument(
      user.userId,
      body.documentId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('search-by-query')
  async searchByQuery(@Body() body: SearchByQueryDto) {
    return this.vectorStoreService.searchByQuery(body.userId, body.query);
  }
}
