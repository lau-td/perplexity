import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';

@Injectable()
export class ChunkingService {
  async chunkDocument(filePath: string, sentencesPerGroup: number = 2) {
    const formData = new FormData();

    formData.append('document', createReadStream(filePath));
    formData.append('sentences_per_group', sentencesPerGroup.toString());

    try {
      const response = await axios.post(
        'http://127.0.0.1:8001/chunk',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to chunk document: ${error.message}`);
    }
  }
}
