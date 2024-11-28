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

    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,
  ) {}

  async execute(query: GetDatasetQuery): Promise<GetDatasetResponseDto> {
    const { id, userId } = query;

    const dataset = await this.datasetRepository.findOne({ id });
    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    if (dataset.userId !== userId) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    const datasetDocuments = await this.datasetDocumentJoinRepository.find({
      datasetId: id,
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
  }
}
