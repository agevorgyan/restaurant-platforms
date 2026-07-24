import { IStorageProvider, StorageProviderHealth } from '../interfaces';
import { ProviderCapabilities } from '../value-objects';
import { 
  AwsS3Provider, 
  CloudflareR2Provider, 
  AzureBlobProvider,
  GcsProvider,
  MinioProvider,
  LocalStorageProvider
} from '../../infrastructure/providers';

export class ProviderConfigurationService {
  public getConfiguration(tenantId: string, providerName: string): any {
    // In a real system, fetch from encrypted secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager)
    return {
      accessKeyId: 'mock-access-key',
      secretAccessKey: 'mock-secret-key',
      region: 'us-east-1',
      endpoint: 'https://mock-endpoint.com'
    };
  }
}

export class StorageProviderRegistry {
  private providers = new Map<string, IStorageProvider>();

  constructor() {
    this.registerProvider(new AwsS3Provider());
    this.registerProvider(new CloudflareR2Provider());
    this.registerProvider(new AzureBlobProvider());
    this.registerProvider(new GcsProvider());
    this.registerProvider(new MinioProvider());
    this.registerProvider(new LocalStorageProvider());
  }

  public registerProvider(provider: IStorageProvider): void {
    this.providers.set(provider.name, provider);
  }

  public getProvider(name: string): IStorageProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Storage provider not found: ${name}`);
    }
    return provider;
  }

  public getAllProviders(): IStorageProvider[] {
    return Array.from(this.providers.values());
  }
}

export class ProviderHealthService {
  constructor(private readonly registry: StorageProviderRegistry) {}

  public async getHealth(providerName: string): Promise<StorageProviderHealth> {
    const provider = this.registry.getProvider(providerName);
    // Assuming providers implement StorageProviderHealthCheck (which they do via BaseMockProvider)
    if ('checkHealth' in provider) {
       return (provider as any).checkHealth();
    }
    return {
      isAvailable: true,
      latencyMs: 0,
      lastChecked: new Date()
    };
  }

  public async getAllHealth(): Promise<Record<string, StorageProviderHealth>> {
    const providers = this.registry.getAllProviders();
    const healthData: Record<string, StorageProviderHealth> = {};
    
    for (const provider of providers) {
      healthData[provider.name] = await this.getHealth(provider.name);
    }
    
    return healthData;
  }
}

export class StorageCapabilityService {
  constructor(private readonly registry: StorageProviderRegistry) {}

  public getCapabilities(providerName: string): ProviderCapabilities {
    const provider = this.registry.getProvider(providerName);
    return provider.getCapabilities();
  }
}

export class StorageRoutingService {
  constructor(
    private readonly registry: StorageProviderRegistry,
    private readonly healthService: ProviderHealthService
  ) {}

  public async determineOptimalProvider(tenantId: string, requirements: { needsVersioning?: boolean, dataClass?: string } = {}): Promise<IStorageProvider> {
    // Basic routing logic: Prefer AWS S3, fallback to R2
    let preferred = 'AWS_S3';
    
    if (requirements.dataClass === 'ARCHIVE') {
       preferred = 'AWS_S3'; // Assuming AWS supports deep archive
    }

    let provider = this.registry.getProvider(preferred);
    let health = await this.healthService.getHealth(provider.name);

    if (!health.isAvailable) {
      console.warn(`[StorageRoutingService] Primary provider ${preferred} is unavailable, failing over.`);
      provider = this.registry.getProvider('CLOUDFLARE_R2');
      health = await this.healthService.getHealth(provider.name);
      
      if (!health.isAvailable) {
        throw new Error('All suitable storage providers are currently unavailable.');
      }
    }

    return provider;
  }
}
