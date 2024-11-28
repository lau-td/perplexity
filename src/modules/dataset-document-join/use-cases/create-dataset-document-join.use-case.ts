import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
} from 'src/core/repository';
import {
  CreateDatasetDocumentJoinInputDto,
  CreateDatasetDocumentJoinResponseDto,
} from '../dtos';

export class CreateDatasetDocumentJoinCommand {
  constructor(public readonly input: CreateDatasetDocumentJoinInputDto) {}
}

@CommandHandler(CreateDatasetDocumentJoinCommand)
export class CreateDatasetDocumentJoinCommandHandler
  implements
    ICommandHandler<
      CreateDatasetDocumentJoinCommand,
      CreateDatasetDocumentJoinResponseDto
    >
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(command: CreateDatasetDocumentJoinCommand) {
    const { input } = command;

    const dataset = await this.datasetRepository.findOne({
      id: input.datasetId,
    });

    if (!dataset || dataset.userId !== input.userId) {
      throw new NotFoundException(
        `Dataset with ID ${input.datasetId} not found`,
      );
    }

    const join = await this.datasetDocumentJoinRepository.create({
      datasetId: input.datasetId,
      documentId: input.documentId,
    });

    return {
      datasetId: join.datasetId,
      documentId: join.documentId,
    };
  }
}
