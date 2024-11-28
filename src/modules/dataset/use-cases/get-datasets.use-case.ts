import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import { IDatasetRepository } from 'src/core/repository';

export class GetDatasetsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetDatasetsQuery)
export class GetDatasetsQueryHandler
  implements IQueryHandler<GetDatasetsQuery>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(query: GetDatasetsQuery) {
    const { userId } = query;

    const datasets = await this.datasetRepository.find({ userId });

    if (!datasets.length) {
      throw new NotFoundException('No datasets found');
    }

    return datasets.map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
    }));
  }
}
