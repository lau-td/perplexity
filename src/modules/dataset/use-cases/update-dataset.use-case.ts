import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDatasetRepository } from 'src/core/repository';
import { UpdateDatasetInputDto, UpdateDatasetResponseDto } from '../dtos';

export class UpdateDatasetCommand {
  constructor(public readonly input: UpdateDatasetInputDto) {}
}

@CommandHandler(UpdateDatasetCommand)
export class UpdateDatasetCommandHandler
  implements ICommandHandler<UpdateDatasetCommand>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(
    command: UpdateDatasetCommand,
  ): Promise<UpdateDatasetResponseDto> {
    const { input } = command;
    const { id, userId, ...updateData } = input;

    const dataset = await this.datasetRepository.findOne({ id });
    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    if (dataset.userId !== userId) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    const updatedDataset = await this.datasetRepository.update(id, updateData);

    return {
      id: updatedDataset.id,
      name: updatedDataset.name,
      description: updatedDataset.description,
    };
  }
}
