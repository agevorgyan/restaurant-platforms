import { AiProvider } from '../interfaces';
import { ModelCapabilityEnum } from '../value-objects';

export class AiProviderRegistry {
  private providers = new Map<string, AiProvider>();

  public registerProvider(provider: AiProvider): void {
    this.providers.set(provider.id, provider);
    // Emit ProviderRegistered
  }

  public getProvider(id: string): AiProvider | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): AiProvider[] {
    return Array.from(this.providers.values());
  }
}

export class ModelRegistryService {
  // Maps modelId to providerId
  public registerModel(providerId: string, modelId: string, capabilities: ModelCapabilityEnum[]): void {
    // Emit ModelRegistered
  }
}

export class CapabilityNegotiationService {
  public supportsCapability(provider: AiProvider, capability: ModelCapabilityEnum): boolean {
    return provider.supportedCapabilities.includes(capability);
  }
}

export class ProviderHealthService {
  public async checkHealth(provider: AiProvider): Promise<boolean> {
    const isHealthy = await provider.healthCheck();
    // Emit ProviderHealthChanged if status changed
    return isHealthy;
  }
}

export class ProviderFailoverService {
  public async executeWithFailover<T>(
    primaryProvider: AiProvider,
    fallbackProvider: AiProvider,
    operation: (provider: AiProvider) => Promise<T>
  ): Promise<T> {
    try {
      return await operation(primaryProvider);
    } catch (error) {
      // Emit ProviderFailoverTriggered
      return await operation(fallbackProvider);
    }
  }
}

export class ModelSelectionService {
  constructor(private readonly registry: AiProviderRegistry) {}

  public selectBestProvider(modelId: string, requiredCapabilities: ModelCapabilityEnum[]): AiProvider {
    // Logic to select provider based on capability, cost, latency, health
    const providers = this.registry.getAllProviders();
    if (providers.length === 0) throw new Error('No providers available');
    return providers[0];
  }
}

export class AiProviderResolver {
  constructor(
    private readonly modelSelection: ModelSelectionService,
    private readonly failoverService: ProviderFailoverService
  ) {}

  public async resolveAndExecute<T>(
    modelId: string,
    capabilities: ModelCapabilityEnum[],
    operation: (provider: AiProvider) => Promise<T>
  ): Promise<T> {
    const primary = this.modelSelection.selectBestProvider(modelId, capabilities);
    // Dummy fallback for illustration
    const fallback = primary;
    return this.failoverService.executeWithFailover(primary, fallback, operation);
  }
}

export class ProviderConfigurationService {
  public async configureTenantProvider(tenantId: string, providerId: string, config: any): Promise<void> {
    // Save tenant-specific API keys and quotas securely
  }
}
