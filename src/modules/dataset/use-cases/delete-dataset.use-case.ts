import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDatasetRepository } from 'src/core/repository';
import { DeleteDatasetInputDto } from '../dtos';

export class DeleteDatasetCommand {
  constructor(public readonly input: DeleteDatasetInputDto) {}
}

@CommandHandler(DeleteDatasetCommand)
export class DeleteDatasetCommandHandler
  implements ICommandHandler<DeleteDatasetCommand>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(command: DeleteDatasetCommand) {
    const { datasetId, userId } = command.input;

    const dataset = await this.datasetRepository.findOne({ id: datasetId });
    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${datasetId} not found`);
    }

    if (dataset.userId !== userId) {
      throw new NotFoundException(`Dataset with ID ${datasetId} not found`);
    }

    await this.datasetRepository.delete(datasetId);
  }
}
