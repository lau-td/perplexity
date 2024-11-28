import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDatasetRepository } from 'src/core/repository';
import { CreateDatasetInputDto, CreateDatasetResponseDto } from '../dtos';

export class CreateDatasetCommand {
  constructor(public readonly input: CreateDatasetInputDto) {}
}

@CommandHandler(CreateDatasetCommand)
export class CreateDatasetCommandHandler
  implements ICommandHandler<CreateDatasetCommand, CreateDatasetResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(command: CreateDatasetCommand) {
    const { input } = command;

    const existingDataset = await this.datasetRepository.findOne({
      name: input.name,
    });

    if (existingDataset) {
      throw new ConflictException('Dataset already exists');
    }

    const dataset = await this.datasetRepository.create(input);
    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
    };
  }
}
