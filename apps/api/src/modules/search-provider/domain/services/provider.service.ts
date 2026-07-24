import { SearchProvider, IndexProvider, HealthProvider, CapabilityProvider } from '../interfaces';
import { ProviderStatusEnum } from '../value-objects';

export class SearchProviderRegistry {
  private readonly providers = new Map<string, SearchProvider & IndexProvider & HealthProvider & CapabilityProvider>();

  public register(id: string, provider: any): void {
    this.providers.set(id, provider);
  }

  public get(id: string): any {
    return this.providers.get(id);
  }

  public getAll(): any[] {
    return Array.from(this.providers.values());
  }
}

export class SearchProviderResolver {
  constructor(private readonly registry: SearchProviderRegistry) {}

  public resolveActiveProvider(tenantId: string): any {
    // In a real system, look up tenant's assigned provider, fallback to global default
    const providers = this.registry.getAll();
    return providers.length > 0 ? providers[0] : null;
  }
}

export class CapabilityNegotiationService {
  public ensureCapabilities(provider: CapabilityProvider, required: string[]): boolean {
    return required.every(cap => provider.supports(cap));
  }
}

export class SearchProviderHealthService {
  constructor(private readonly registry: SearchProviderRegistry) {}

  public async checkAllProviders(): Promise<void> {
    // Ping all providers and emit ProviderHealthChanged if status changes
  }
}

export class ProviderFailoverService {
  public async failover(tenantId: string, failedProviderId: string): Promise<string> {
    // Circuit breaker logic: if main provider is DEGRADED, switch to backup
    // Emit ProviderFailedOver
    return 'backup-provider-id';
  }
}

export class ProviderConfigurationService {
  public async configureProvider(tenantId: string, config: any): Promise<void> {
    // Save config and initialize provider factory
  }
}

export class SearchProviderFactory {
  public createProvider(type: string, config: any): any {
    // Factory method for Elasticsearch, OpenSearch, etc.
    return null;
  }
}
