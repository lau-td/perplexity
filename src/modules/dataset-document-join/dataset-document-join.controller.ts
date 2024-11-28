import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { AuthPayload } from '../uploader/interfaces';
import {
  CreateDatasetDocumentJoinCommand,
  DeleteDatasetDocumentJoinCommand,
  GetDatasetDocumentJoinQuery,
} from './use-cases';
import {
  CreateDatasetDocumentJoinBodyDto,
  CreateDatasetDocumentJoinResponseDto,
  DeleteDatasetDocumentJoinBodyDto,
  GetDatasetDocumentJoinResponseDto,
} from './dtos';

@Controller('dataset-document-joins')
@UseGuards(JwtAuthGuard)
export class DatasetDocumentJoinController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthPayload,
    @Body() body: CreateDatasetDocumentJoinBodyDto,
  ): Promise<CreateDatasetDocumentJoinResponseDto> {
    return this.commandBus.execute(
      new CreateDatasetDocumentJoinCommand({
        ...body,
        userId: user.userId,
      }),
    );
  }

  @Get('dataset/:datasetId')
  findByDataset(
    @CurrentUser() user: AuthPayload,
    @Param('datasetId') datasetId: string,
  ): Promise<GetDatasetDocumentJoinResponseDto[]> {
    return this.queryBus.execute(
      new GetDatasetDocumentJoinQuery({
        datasetId,
        userId: user.userId,
      }),
    );
  }

  @Delete()
  remove(
    @CurrentUser() user: AuthPayload,
    @Body() body: DeleteDatasetDocumentJoinBodyDto,
  ) {
    return this.commandBus.execute(
      new DeleteDatasetDocumentJoinCommand({
        ...body,
        userId: user.userId,
      }),
    );
  }
}
