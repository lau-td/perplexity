import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
} from 'src/core/repository';
import {
  GetDatasetDocumentJoinByDatasetInputDto,
  GetDatasetDocumentJoinResponseDto,
} from '../dtos';

export class GetDatasetDocumentJoinQuery {
  constructor(public readonly input: GetDatasetDocumentJoinByDatasetInputDto) {}
}

@QueryHandler(GetDatasetDocumentJoinQuery)
export class GetDatasetDocumentJoinQueryHandler
  implements
    IQueryHandler<
      GetDatasetDocumentJoinQuery,
      GetDatasetDocumentJoinResponseDto[]
    >
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
  ) {}

  async execute(query: GetDatasetDocumentJoinQuery) {
    const { input } = query;

    const dataset = await this.datasetRepository.findOne({
      id: input.datasetId,
    });

    if (!dataset || dataset.userId !== input.userId) {
      throw new NotFoundException(
        `Dataset with ID ${input.datasetId} not found`,
      );
    }

    const joins = await this.datasetDocumentJoinRepository.find({
      datasetId: input.datasetId,
    });

    return joins.map((join) => ({
      datasetId: join.datasetId,
      documentId: join.documentId,
    }));
  }
}
