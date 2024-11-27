import weaviate, {
  WeaviateClient,
  ApiKey,
  WhereFilter,
} from 'weaviate-ts-client';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();

interface AddTextsInput {
  texts: string[];
  embeddings: number[][];
  metadata?: string[];
}

@Injectable()
export class WeaviateService {
  private client: WeaviateClient;

  constructor() {
    this.client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
      apiKey: new ApiKey('WVF5YThaHlkYwhGUSmCRgsX3tD5ngdN8pkih'),
    });
  }

  /**
   * Creates a new collection (class) in Weaviate
   * @param className Name of the collection to create
   * @returns Promise<void>
   */
  async createCollection(className: string): Promise<void> {
    try {
      const schemaConfig = {
        class: className,
        vectorizer: 'none', // Using custom vectors
        properties: [
          {
            name: 'text',
            dataType: ['text'],
          },
          {
            name: 'metadata',
            dataType: ['text'],
          },
        ],
      };

      const classExists = await this.client.schema.exists(className);
      if (!classExists) {
        await this.client.schema.classCreator().withClass(schemaConfig).do();
        console.log(`Created collection: ${className}`);
      }
    } catch (error) {
      throw new Error(`Failed to create collection: ${error.message}`);
    }
  }

  async getCollectionInfo(className: string): Promise<any> {
    const classInfo = await this.client.schema
      .classGetter()
      .withClassName(className)
      .do();
    return classInfo;
  }

  /**
   * Adds texts and their pre-computed embeddings to a collection
   * @param input Object containing texts, embeddings, and optional metadata
   * @param className Name of the collection to add to
   * @returns Promise<void>
   */
  async addTexts(
    { texts, embeddings, metadata = [] }: AddTextsInput,
    className: string,
  ): Promise<void> {
    try {
      if (texts.length !== embeddings.length) {
        throw new Error('Number of texts must match number of embeddings');
      }

      // Import data
      // TODO: Add batching
      for (let index = 0; index < texts.length; index++) {
        await this.client.data
          .creator()
          .withClassName(className)
          .withProperties({
            text: texts[index],
            metadata: metadata[index],
          })
          .withVector(embeddings[index])
          .do();
      }

      // // Prepare batch objects with vectors in the correct format
      // const batchObjects = texts.map((text, index) => ({
      //   class: className,
      //   properties: {
      //     text,
      //     metadata: metadata[index] ? JSON.parse(metadata[index]) : {},
      //   },
      //   // Send vector in both formats to handle different Weaviate versions
      //   vector: embeddings[index],
      //   vectors: {
      //     default: embeddings[index],
      //   },
      // }));

      // // Add objects in batches
      // await this.client.batch
      //   .objectsBatcher()
      //   .withObjects(...batchObjects)
      //   .do();

      console.log(`Added ${texts.length} texts to ${className}`);
    } catch (error) {
      throw new Error(`Failed to add texts: ${error.message}`);
    }
  }

  /**
   * Searches for similar vectors in a collection
   * @param queryVector The embedding vector to search with
   * @param className Name of the collection to search in
   * @param limit Maximum number of results to return
   * @returns Promise containing array of search results
   */
  async search(
    queryVector: number[],
    className: string,
    limit: number = 5,
    filter?: WhereFilter,
  ): Promise<Array<{ text: string; metadata: any; score: number }>> {
    try {
      const queryBuilder = this.client.graphql
        .get()
        .withClassName(className)
        .withFields('text metadata _additional { certainty }')
        .withNearVector({
          vector: queryVector,
        })
        .withLimit(limit);

      // Add filter if provided
      if (filter) {
        queryBuilder.withWhere(filter);
      }

      // Format results
      const result = await queryBuilder.do();
      return result.data.Get[className].map((item: any) => ({
        text: item.text,
        metadata: item.metadata,
        score: item._additional?.certainty || 0,
      }));
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Deletes a collection
   * @param className Name of the collection to delete
   * @returns Promise<void>
   */
  async deleteCollection(className: string): Promise<void> {
    try {
      await this.client.schema.classDeleter().withClassName(className).do();
      console.log(`Deleted collection: ${className}`);
    } catch (error) {
      throw new Error(`Failed to delete collection: ${error.message}`);
    }
  }

  /**
   * Deletes objects from a collection based on metadata filter
   * @param className Name of the collection to delete from
   * @param filter WhereFilter object to match objects for deletion
   * @returns Promise<void>
   */
  async deleteByMetadata(
    className: string,
    filter: WhereFilter,
  ): Promise<void> {
    try {
      await this.client.batch
        .objectsBatchDeleter()
        .withClassName(className)
        .withWhere(filter)
        .do();

      console.log(`Deleted objects from ${className} matching filter`);
    } catch (error) {
      throw new Error(`Failed to delete objects: ${error.message}`);
    }
  }

  /**
   * Updates metadata for objects matching the filter
   * @param className Name of the collection to update
   * @param filter WhereFilter object to match objects for update
   * @param newMetadata New metadata to set
   * @returns Promise<void>
   */
  async updateMetadataByFilter(
    className: string,
    filter: WhereFilter,
    newMetadata: any,
  ): Promise<void> {
    try {
      // First get the objects that match the filter
      const result = await this.client.graphql
        .get()
        .withClassName(className)
        .withFields('_additional { id }')
        .withWhere(filter)
        .do();

      const objects = result.data.Get[className];

      if (!objects || objects.length === 0) {
        console.log(`No objects found matching filter in ${className}`);
        return;
      }

      // Update each matching object with new metadata
      await Promise.all(
        objects.map(async (obj: any) => {
          await this.client.data
            .updater()
            .withId(obj._additional.id)
            .withClassName(className)
            .withProperties({
              metadata: JSON.stringify(newMetadata),
            })
            .do();
        }),
      );

      console.log(
        `Updated metadata for ${objects.length} objects in ${className}`,
      );
    } catch (error) {
      throw new Error(`Failed to update metadata: ${error.message}`);
    }
  }

  /**
   * Checks if a record with specific metadata exists in the collection
   * @param embedding Vector embedding to use for similarity search
   * @param className Name of the collection to search in
   * @param metadata Metadata to check for
   * @returns Promise<boolean> True if record exists, false otherwise
   */
  async recordExists(
    embedding: number[],
    className: string,
    metadata: string,
  ): Promise<boolean> {
    try {
      const filter: WhereFilter = {
        operator: 'Equal',
        path: ['metadata'],
        valueText: metadata,
      };

      const existingRecords = await this.search(
        embedding,
        className,
        1,
        filter,
      );
      return existingRecords.length > 0;
    } catch (error) {
      throw new Error(`Failed to check record existence: ${error.message}`);
    }
  }

  /**
   * Checks if texts with given metadata exist and adds only new texts
   * @param input Object containing texts, embeddings, and optional metadata
   * @param className Name of the collection to add to
   * @returns Promise<void>
   */
  async enhanceAddTexts(
    { texts, embeddings, metadata = [] }: AddTextsInput,
    className: string,
  ): Promise<void> {
    try {
      if (texts.length !== embeddings.length) {
        throw new Error('Number of texts must match number of embeddings');
      }

      for (let index = 0; index < texts.length; index++) {
        if (!metadata[index]) {
          continue;
        }

        // Use the new recordExists function
        const exists = await this.recordExists(
          embeddings[index],
          className,
          metadata[index],
        );

        if (exists) {
          console.log(
            `Skipping text with existing metadata: ${metadata[index]}`,
          );
          continue;
        }

        await this.client.data
          .creator()
          .withClassName(className)
          .withProperties({
            text: texts[index],
            metadata: metadata[index],
          })
          .withVector(embeddings[index])
          .do();

        console.log(`Added new text with metadata: ${metadata[index]}`);
      }

      console.log(`Finished processing ${texts.length} texts for ${className}`);
    } catch (error) {
      throw new Error(`Failed to enhance add texts: ${error.message}`);
    }
  }
}

export async function example() {
  const weaviate = new WeaviateService();
  await weaviate.createCollection('Documents');

  await weaviate.addTexts(
    {
      texts: ['First document content', 'Second document content'],
      embeddings: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ],
      metadata: [
        JSON.stringify({ author: 'John', age: 20 }),
        JSON.stringify({ author: 'Jane', age: 30 }),
      ],
    },
    'Documents',
  );

  const queryVector = [0.1, 0.2, 0.3];
  const filter: WhereFilter = {
    operator: 'Or',
    operands: [
      {
        operator: 'Equal',
        path: ['metadata'],
        valueText: JSON.stringify({ age: 20 }),
      },
      {
        operator: 'Equal',
        path: ['metadata'],
        valueText: JSON.stringify({ age: 40 }),
      },
    ],
  };

  const results = await weaviate.search(queryVector, 'Documents', 5, filter);
  console.log(results);
  await weaviate.deleteByMetadata('Documents', filter);

  const results2 = await weaviate.search(queryVector, 'Documents', 5, filter);
  console.log(results2);

  await weaviate.deleteCollection('Documents');
}

// example();
