import { 
  IStorageProvider, 
  StorageProviderHealthCheck, 
  StorageProviderHealth, 
  StorageObjectMetadata 
} from '../../domain/interfaces';
import { ProviderCapabilities } from '../../domain/value-objects';

export abstract class BaseMockProvider implements IStorageProvider, StorageProviderHealthCheck {
  abstract readonly name: string;
  protected capabilities: ProviderCapabilities;

  constructor(capabilities?: any) {
    this.capabilities = ProviderCapabilities.create(capabilities || {
      supportsPresignedUrls: true,
      supportsVersioning: true,
      supportsEncryption: true,
      supportsStorageClasses: true,
      supportedStorageClasses: ['HOT', 'WARM', 'COLD', 'ARCHIVE']
    });
  }

  getCapabilities(): ProviderCapabilities {
    return this.capabilities;
  }

  async checkHealth(): Promise<StorageProviderHealth> {
    return {
      isAvailable: true,
      latencyMs: Math.floor(Math.random() * 50) + 10,
      lastChecked: new Date(),
    };
  }

  async upload(bucket: string, key: string, data: Buffer, mimeType: string, metadata?: Record<string, string>): Promise<void> {
    console.log(`[${this.name}] Uploaded ${key} to ${bucket}`);
  }

  async download(bucket: string, key: string): Promise<Buffer> {
    console.log(`[${this.name}] Downloaded ${key} from ${bucket}`);
    return Buffer.from('mock-data');
  }

  async delete(bucket: string, key: string): Promise<void> {
    console.log(`[${this.name}] Deleted ${key} from ${bucket}`);
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<void> {
    console.log(`[${this.name}] Copied ${sourceKey} to ${destKey}`);
  }

  async move(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<void> {
    console.log(`[${this.name}] Moved ${sourceKey} to ${destKey}`);
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    return true;
  }

  async getMetadata(bucket: string, key: string): Promise<StorageObjectMetadata> {
    return {
      size: 1024,
      mimeType: 'application/octet-stream',
      lastModified: new Date(),
      metadata: {}
    };
  }

  async list(bucket: string, prefix?: string): Promise<{ keys: string[]; nextContinuationToken?: string }> {
    return { keys: [`${prefix || ''}file1.txt`, `${prefix || ''}file2.jpg`] };
  }

  async generatePresignedUploadUrl(bucket: string, key: string, expiresInSeconds: number = 3600): Promise<string> {
    return `https://${this.name.toLowerCase()}.mock-storage.com/${bucket}/${key}?uploadId=${crypto.randomUUID()}&expires=${expiresInSeconds}`;
  }

  async generatePresignedDownloadUrl(bucket: string, key: string, expiresInSeconds: number = 3600): Promise<string> {
    return `https://${this.name.toLowerCase()}.mock-storage.com/${bucket}/${key}?downloadId=${crypto.randomUUID()}&expires=${expiresInSeconds}`;
  }
}

export class AwsS3Provider extends BaseMockProvider {
  readonly name = 'AWS_S3';
}

export class CloudflareR2Provider extends BaseMockProvider {
  readonly name = 'CLOUDFLARE_R2';
  constructor() {
    super({
      supportsPresignedUrls: true,
      supportsVersioning: false, // Simulated limitation
      supportsEncryption: true,
      supportsStorageClasses: false,
      supportedStorageClasses: ['HOT']
    });
  }
}

export class AzureBlobProvider extends BaseMockProvider {
  readonly name = 'AZURE_BLOB';
}

export class GcsProvider extends BaseMockProvider {
  readonly name = 'GOOGLE_CLOUD_STORAGE';
}

export class MinioProvider extends BaseMockProvider {
  readonly name = 'MINIO';
}

export class LocalStorageProvider extends BaseMockProvider {
  readonly name = 'LOCAL_STORAGE';
  constructor() {
    super({
      supportsPresignedUrls: false,
      supportsVersioning: false,
      supportsEncryption: false,
      supportsStorageClasses: false,
      supportedStorageClasses: ['HOT']
    });
  }
}
