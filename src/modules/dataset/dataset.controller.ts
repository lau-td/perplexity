import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';
import { AuthPayload } from '../uploader/interfaces';
import {
  CreateDatasetCommand,
  UpdateDatasetCommand,
  DeleteDatasetCommand,
  GetDatasetQuery,
  GetDatasetsQuery,
  CreateDatasetDocumentJoinCommand,
  DeleteDatasetDocumentJoinCommand,
} from './use-cases';
import {
  CreateDatasetBodyDto,
  CreateDatasetDocumentJoinBodyDto,
  CreateDatasetDocumentJoinResponseDto,
  CreateDatasetResponseDto,
  UpdateDatasetBodyDto,
  UpdateDatasetResponseDto,
} from './dtos';

@Controller('datasets')
@UseGuards(JwtAuthGuard)
export class DatasetController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthPayload, @Body() body: CreateDatasetBodyDto) {
    return this.commandBus.execute<
      CreateDatasetCommand,
      CreateDatasetResponseDto
    >(
      new CreateDatasetCommand({
        ...body,
        userId: user.userId,
      }),
    );
  }

  @Get()
  findAll(@CurrentUser() user: AuthPayload) {
    return this.queryBus.execute(new GetDatasetsQuery(user.userId));
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthPayload, @Param('id') id: string) {
    return this.queryBus.execute(new GetDatasetQuery(id, user.userId));
  }

  @Put(':id')
  update(
    @CurrentUser() user: AuthPayload,
    @Param('id') id: string,
    @Body() body: UpdateDatasetBodyDto,
  ) {
    return this.commandBus.execute<
      UpdateDatasetCommand,
      UpdateDatasetResponseDto
    >(
      new UpdateDatasetCommand({
        id,
        userId: user.userId,
        ...body,
      }),
    );
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthPayload, @Param('id') id: string) {
    return this.commandBus.execute(
      new DeleteDatasetCommand({
        datasetId: id,
        userId: user.userId,
      }),
    );
  }

  @Post(':id/document')
  createDocumentJoin(
    @CurrentUser() user: AuthPayload,
    @Param('id') id: string,
    @Body() body: CreateDatasetDocumentJoinBodyDto,
  ): Promise<CreateDatasetDocumentJoinResponseDto> {
    return this.commandBus.execute(
      new CreateDatasetDocumentJoinCommand({
        datasetId: id,
        documentId: body.documentId,
        userId: user.userId,
      }),
    );
  }

  @Delete(':datasetId/document/:documentId')
  removeDocumentJoin(
    @CurrentUser() user: AuthPayload,
    @Param('datasetId') datasetId: string,
    @Param('documentId') documentId: string,
  ) {
    return this.commandBus.execute(
      new DeleteDatasetDocumentJoinCommand({
        datasetId,
        documentId,
        userId: user.userId,
      }),
    );
  }
}
