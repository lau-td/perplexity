import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
} from 'src/core/repository';
import { DeleteDatasetDocumentJoinInputDto } from '../dtos';

export class DeleteDatasetDocumentJoinCommand {
  constructor(public readonly input: DeleteDatasetDocumentJoinInputDto) {}
}

@CommandHandler(DeleteDatasetDocumentJoinCommand)
export class DeleteDatasetDocumentJoinCommandHandler
  implements ICommandHandler<DeleteDatasetDocumentJoinCommand>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(command: DeleteDatasetDocumentJoinCommand) {
    const { input } = command;

    const dataset = await this.datasetRepository.findOne({
      id: input.datasetId,
    });

    if (!dataset || dataset.userId !== input.userId) {
      throw new NotFoundException(
        `Dataset with ID ${input.datasetId} not found`,
      );
    }

    const join = await this.datasetDocumentJoinRepository.findOne({
      datasetId: input.datasetId,
      documentId: input.documentId,
    });

    if (!join) {
      throw new NotFoundException('Dataset document join not found');
    }

    await this.datasetDocumentJoinRepository.deleteByCondition({
      datasetId: input.datasetId,
      documentId: input.documentId,
    });
  }
}
