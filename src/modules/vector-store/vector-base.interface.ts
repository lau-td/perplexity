export interface Document {
  id?: string;
  pageContent: string;
  metadata: Record<string, any>;
}

export interface VectorSearchResult {
  document: Document;
  score: number;
}

export interface VectorStoreOptions {
  embeddings: EmbeddingModel;
  indexName?: string;
  batchSize?: number;
  distance?: 'cosine' | 'euclidean' | 'dot';
}

export interface QueryOptions {
  k?: number; // Number of results to return
  filter?: object; // Metadata filters
  minScore?: number; // Minimum similarity score threshold
}

export interface EmbeddingModel {
  embed(texts: string[]): Promise<number[][]>;
  embedQuery(text: string): Promise<number[]>;
}

export interface VectorStoreBase {
  /**
   * Add documents to the vector store
   */
  addDocuments(documents: Document[]): Promise<void>;

  /**
   * Delete documents from the vector store
   */
  deleteDocuments(ids: string[]): Promise<void>;

  /**
   * Perform similarity search using a query string
   */
  similaritySearch(
    query: string,
    options?: QueryOptions,
  ): Promise<VectorSearchResult[]>;

  /**
   * Perform similarity search using a vector
   */
  similaritySearchByVector(
    vector: number[],
    options?: QueryOptions,
  ): Promise<VectorSearchResult[]>;

  /**
   * Hybrid search combining vector similarity and keyword matching
   */
  hybridSearch(
    query: string,
    options?: QueryOptions & { alpha?: number },
  ): Promise<VectorSearchResult[]>;

  /**
   * Get the total number of documents in the store
   */
  documentCount(): Promise<number>;

  /**
   * Clear all documents from the store
   */
  clear(): Promise<void>;

  /**
   * Ensure indexes are created and optimized
   */
  ensureIndexes(): Promise<void>;
}
