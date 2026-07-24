export interface ICdnProvider {
  name: string;
  isAvailable(): boolean;
  generateUrl(storageKey: string, isPrivate: boolean, expiresInSeconds?: number): Promise<string>;
  invalidateCache(cacheKeys: string[]): Promise<boolean>;
}

export class CdnProviderRegistry {
  private providers: Map<string, ICdnProvider> = new Map();

  public register(provider: ICdnProvider): void {
    this.providers.set(provider.name, provider);
  }

  public getProvider(name: string): ICdnProvider {
    const provider = this.providers.get(name);
    if (!provider) throw new Error(`CDN Provider ${name} not found`);
    return provider;
  }

  public getAvailableProviders(): ICdnProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isAvailable());
  }
}

export class DeliveryRoutingService {
  constructor(private readonly registry: CdnProviderRegistry) {}

  public determineOptimalProvider(tenantId: string, requestRegion?: string): ICdnProvider {
    const providers = this.registry.getAvailableProviders();
    if (providers.length === 0) {
      throw new Error('No CDN providers currently available');
    }
    // E.g., Use Cloudflare by default, fallback to CloudFront
    return providers[0];
  }
}

export class SignedUrlService {
  constructor(private readonly registry: CdnProviderRegistry) {}

  public async generateSignedUrl(provider: ICdnProvider, storageKey: string, ttlSeconds: number): Promise<string> {
    // Abstract logic for HMAC signatures
    return provider.generateUrl(storageKey, true, ttlSeconds);
  }
}

export class CacheManagementService {
  constructor(private readonly registry: CdnProviderRegistry) {}

  public async purge(cacheKeys: string[]): Promise<void> {
    const providers = this.registry.getAvailableProviders();
    for (const provider of providers) {
      // Best effort cache invalidation across all active CDNs
      await provider.invalidateCache(cacheKeys).catch(err => {
        console.error(`Failed to invalidate cache on ${provider.name}`, err);
      });
    }
  }
}

export class MediaDeliveryService {
  constructor(
    private readonly routing: DeliveryRoutingService,
    private readonly signedUrlService: SignedUrlService
  ) {}

  public async getDeliveryUrl(
    tenantId: string,
    mediaId: string,
    storageKey: string,
    isPrivate: boolean = false,
    ttlSeconds: number = 3600
  ): Promise<string> {
    const provider = this.routing.determineOptimalProvider(tenantId);
    
    if (isPrivate) {
      return this.signedUrlService.generateSignedUrl(provider, storageKey, ttlSeconds);
    }
    
    return provider.generateUrl(storageKey, false);
  }
}

export class DeliveryAnalyticsService {
  public recordDelivery(tenantId: string, mediaId: string, bytesDelivered: number, providerName: string): void {
    // Collect stats for billing and performance monitoring
  }
}
