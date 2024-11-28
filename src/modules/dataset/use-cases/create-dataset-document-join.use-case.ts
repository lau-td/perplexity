import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { REPOSITORY_INJECTION_TOKEN } from 'src/common/enums';
import {
  IDatasetDocumentJoinRepository,
  IDatasetRepository,
  IDocumentRepository,
  IYoutubeRepository,
} from 'src/core/repository';
import {
  CreateDatasetDocumentJoinInputDto,
  CreateDatasetDocumentJoinResponseDto,
} from '../dtos';

export class CreateDatasetDocumentJoinCommand {
  constructor(public readonly input: CreateDatasetDocumentJoinInputDto) {}
}

@CommandHandler(CreateDatasetDocumentJoinCommand)
export class CreateDatasetDocumentJoinCommandHandler
  implements
    ICommandHandler<
      CreateDatasetDocumentJoinCommand,
      CreateDatasetDocumentJoinResponseDto
    >
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_DOCUMENT_JOIN_REPOSITORY)
    private readonly datasetDocumentJoinRepository: IDatasetDocumentJoinRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DATASET_REPOSITORY)
    private readonly datasetRepository: IDatasetRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.YOUTUBE_REPOSITORY)
    private readonly youtubeRepository: IYoutubeRepository,
  ) {}

  async execute(
    command: CreateDatasetDocumentJoinCommand,
  ): Promise<CreateDatasetDocumentJoinResponseDto> {
    const { input } = command;

    const dataset = await this.datasetRepository.findOne({
      id: input.datasetId,
    });

    if (!dataset || dataset.userId !== input.userId) {
      throw new NotFoundException(
        `Dataset with ID ${input.datasetId} not found`,
      );
    }

    await this.datasetDocumentJoinRepository.create({
      datasetId: input.datasetId,
      documentId: input.documentId,
    });

    const datasetDocuments = await this.datasetDocumentJoinRepository.find({
      datasetId: input.datasetId,
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
