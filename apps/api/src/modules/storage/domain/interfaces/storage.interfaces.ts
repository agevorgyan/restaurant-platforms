import { ProviderCapabilities } from '../value-objects';

export interface StorageObjectMetadata {
  size: number;
  mimeType: string;
  checksum?: string;
  lastModified: Date;
  metadata: Record<string, string>;
}

export interface IStorageProvider {
  /**
   * The unique identifier for the provider implementation (e.g., 'AWS_S3')
   */
  readonly name: string;

  /**
   * Returns the capabilities of this provider
   */
  getCapabilities(): ProviderCapabilities;

  /**
   * Uploads a file directly (used for small files or backend processing)
   */
  upload(bucket: string, key: string, data: Buffer, mimeType: string, metadata?: Record<string, string>): Promise<void>;

  /**
   * Downloads a file directly
   */
  download(bucket: string, key: string): Promise<Buffer>;

  /**
   * Deletes an object
   */
  delete(bucket: string, key: string): Promise<void>;

  /**
   * Copies an object within the same provider
   */
  copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<void>;

  /**
   * Moves an object within the same provider
   */
  move(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<void>;

  /**
   * Checks if an object exists
   */
  exists(bucket: string, key: string): Promise<boolean>;

  /**
   * Gets metadata for an object
   */
  getMetadata(bucket: string, key: string): Promise<StorageObjectMetadata>;

  /**
   * Lists objects with a given prefix
   */
  list(bucket: string, prefix?: string, limit?: number, continuationToken?: string): Promise<{
    keys: string[];
    nextContinuationToken?: string;
  }>;

  /**
   * Generates a presigned URL for direct client uploads
   */
  generatePresignedUploadUrl(bucket: string, key: string, expiresInSeconds?: number, mimeType?: string): Promise<string>;

  /**
   * Generates a presigned URL for secure direct client downloads
   */
  generatePresignedDownloadUrl(bucket: string, key: string, expiresInSeconds?: number): Promise<string>;
}

export interface StorageProviderHealth {
  isAvailable: boolean;
  latencyMs: number;
  lastChecked: Date;
  details?: Record<string, any>;
}

export interface StorageProviderHealthCheck {
  checkHealth(): Promise<StorageProviderHealth>;
}
