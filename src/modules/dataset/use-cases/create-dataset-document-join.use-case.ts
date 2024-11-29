import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
} from 'src/core/repository';
import { CreateDatasetDocumentJoinInputDto } from '../dtos';

export class CreateDatasetDocumentJoinCommand {
  constructor(public readonly input: CreateDatasetDocumentJoinInputDto) {}
}

@CommandHandler(CreateDatasetDocumentJoinCommand)
export class CreateDatasetDocumentJoinCommandHandler
  implements ICommandHandler<CreateDatasetDocumentJoinCommand, void>
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

    const existDatasetDocumentJoin =
      await this.datasetDocumentJoinRepository.findOne({
        datasetId: input.datasetId,
        documentId: input.documentId,
      });

    if (existDatasetDocumentJoin) {
      throw new ConflictException('Dataset document join already exists');
    }

    await this.datasetDocumentJoinRepository.create({
      datasetId: input.datasetId,
      documentId: input.documentId,
    });
  }
}
