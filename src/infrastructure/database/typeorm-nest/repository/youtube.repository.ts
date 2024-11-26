import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { YoutubeEntity } from 'src/core/entities';
import { IYoutubeRepository } from 'src/core/repository';
import { Repository } from 'typeorm';

import { Youtube } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class YoutubeRepository
  extends GenericRepository<Youtube, YoutubeEntity>(Youtube)
  implements IYoutubeRepository
{
  constructor(
    @InjectRepository(Youtube)
    public readonly repository: Repository<Youtube>,
  ) {
    const toDomainEntity = (typeOrmEntity: Youtube): YoutubeEntity => {
      return plainToInstance(YoutubeEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
