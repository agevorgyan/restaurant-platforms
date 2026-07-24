import { Identifier, DomainPrimitive } from '@saas/domain';

export class StorageProviderId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageProviderId { return new StorageProviderId(value); }
  public static generate(): StorageProviderId { return new StorageProviderId(crypto.randomUUID()); }
}

export class StorageRegion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageRegion {
    if (!value || value.trim().length === 0) throw new Error('StorageRegion cannot be empty');
    return new StorageRegion(value);
  }
}

export class StorageEndpoint extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageEndpoint {
    if (!value || value.trim().length === 0) throw new Error('StorageEndpoint cannot be empty');
    try {
      new URL(value); // Validate URL format
    } catch {
      throw new Error(`Invalid StorageEndpoint URL: ${value}`);
    }
    return new StorageEndpoint(value);
  }
}

export class StorageUrl extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): StorageUrl {
    if (!value || value.trim().length === 0) throw new Error('StorageUrl cannot be empty');
    try {
      new URL(value);
    } catch {
      throw new Error(`Invalid StorageUrl URL: ${value}`);
    }
    return new StorageUrl(value);
  }
}

export class BucketName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BucketName {
    if (!value || value.trim().length === 0) throw new Error('BucketName cannot be empty');
    return new BucketName(value);
  }
}

export interface StorageConfigurationProps {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  endpoint?: string;
  useSsl?: boolean;
}

export class StorageConfiguration extends DomainPrimitive<StorageConfigurationProps> {
  private constructor(value: StorageConfigurationProps) { super(value); }
  public static create(value: StorageConfigurationProps): StorageConfiguration {
    if (!value.accessKeyId) throw new Error('accessKeyId is required');
    if (!value.secretAccessKey) throw new Error('secretAccessKey is required');
    return new StorageConfiguration(value);
  }
}

export interface ProviderCapabilitiesProps {
  supportsPresignedUrls: boolean;
  supportsVersioning: boolean;
  supportsEncryption: boolean;
  supportsStorageClasses: boolean;
  supportedStorageClasses: string[];
}

export class ProviderCapabilities extends DomainPrimitive<ProviderCapabilitiesProps> {
  private constructor(value: ProviderCapabilitiesProps) { super(value); }
  public static create(value: ProviderCapabilitiesProps): ProviderCapabilities {
    return new ProviderCapabilities(value);
  }
}
