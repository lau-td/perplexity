import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDatasetRepository } from 'src/core/repository';

export class GetDatasetQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}

@QueryHandler(GetDatasetQuery)
export class GetDatasetQueryHandler implements IQueryHandler<GetDatasetQuery> {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(query: GetDatasetQuery) {
    const { id, userId } = query;

    const dataset = await this.datasetRepository.findOne({ id });
    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    if (dataset.userId !== userId) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    return {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
    };
  }
}
