import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
  IDocumentRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import { GetDatasetResponseDto } from '../dtos';

export class GetDatasetsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetDatasetsQuery)
export class GetDatasetsQueryHandler
  implements IQueryHandler<GetDatasetsQuery, GetDatasetResponseDto[]>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,
  ) {}

  async execute(query: GetDatasetsQuery): Promise<GetDatasetResponseDto[]> {
    const { userId } = query;

    const datasets = await this.datasetRepository.find({ userId });

    if (!datasets.length) {
      throw new NotFoundException('No datasets found');
    }

    const datasetsWithDocuments = await Promise.all(
      datasets.map(async (dataset) => {
        const datasetDocuments = await this.datasetDocumentJoinRepository.find({
          datasetId: dataset.id,
        });

        const documents = await Promise.all(
          datasetDocuments.map(async (join) => {
            const document = await this.documentRepository.findOne({
              id: join.documentId,
            });
            const youtube = await this.youtubeRepository.findOne({
              id: document.youtubeId,
            });
            return {
              id: document.id,
              youtube: {
                name: youtube.name,
                videoId: youtube.videoId,
                url: youtube.url,
              },
            };
          }),
        );

        return {
          id: dataset.id,
          name: dataset.name,
          description: dataset.description,
          documents,
        };
      }),
    );

    return datasetsWithDocuments;
  }
}
