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
} from './use-cases';
import {
  CreateDatasetBodyDto,
  CreateDatasetResponseDto,
  DeleteDatasetBodyDto,
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

  @Delete()
  remove(@CurrentUser() user: AuthPayload, @Body() body: DeleteDatasetBodyDto) {
    return this.commandBus.execute(
      new DeleteDatasetCommand({
        ...body,
        userId: user.userId,
      }),
    );
  }
}
