import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guards';
import {
  GetChaptersByUserQueryDto,
  GenerateChaptersByUserBodyDto,
  GetChaptersByUserResponseDto,
  GenerateChaptersByUserResponseDto,
} from './dtos';
import {
  GenerateChaptersByUserCommand,
  GetChaptersByUserQuery,
} from './use-cases';
import { CurrentUser } from 'src/common/decorators';
import { AuthPayload } from '../auth/interfaces';

@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChapterController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getChaptersByUser(
    @CurrentUser() user: AuthPayload,
    @Query() query: GetChaptersByUserQueryDto,
  ): Promise<GetChaptersByUserResponseDto[]> {
    const input = {
      ...query,
      userId: user.userId,
    };
    return this.queryBus.execute(new GetChaptersByUserQuery(input));
  }

  @Post('generate')
  async generateChaptersByUser(
    @CurrentUser() user: AuthPayload,
    @Body() body: GenerateChaptersByUserBodyDto,
  ): Promise<GenerateChaptersByUserResponseDto> {
    const input = {
      ...body,
      userId: user.userId,
    };
    await this.commandBus.execute(new GenerateChaptersByUserCommand(input));

    return {
      result: 'Chapters generated successfully',
    };
  }
}
