import { 
  ConnectorDefinition, 
  InstalledConnector,
  ConnectorHealthStatus,
  ConnectorCapabilityModel
} from '../read-models';

export class CapabilityDiscoveryService {
  public discoverCapabilities(code: string): ConnectorCapabilityModel[] {
    return [
      {
        capabilityId: 'cap-auth',
        name: 'OAuth2 Authentication',
        description: 'Supports standard OAuth2 authorization code flow',
        isRequired: true
      },
      {
        capabilityId: 'cap-sync',
        name: 'Bidirectional Sync',
        description: 'Supports syncing data in both directions',
        isRequired: false
      }
    ];
  }
}

export class ConnectorRegistry {
  private definitions: Map<string, ConnectorDefinition> = new Map();

  constructor(private readonly discovery: CapabilityDiscoveryService) {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    const stripeDef: ConnectorDefinition = {
      connectorId: crypto.randomUUID(),
      code: 'STRIPE_PAY',
      name: 'Stripe Payments',
      type: 'PAYMENT',
      version: '1.0.0',
      provider: 'Stripe, Inc.',
      description: 'Official Stripe payment gateway integration',
      capabilities: this.discovery.discoverCapabilities('STRIPE_PAY'),
      createdAt: new Date()
    };
    this.definitions.set(stripeDef.connectorId, stripeDef);
  }

  public getCatalog(): ConnectorDefinition[] {
    return Array.from(this.definitions.values());
  }

  public getConnector(id: string): ConnectorDefinition | undefined {
    return this.definitions.get(id);
  }
}

export class CredentialManagementService {
  public async storeCredentials(tenantId: string, connectorId: string, credentials: any): Promise<boolean> {
    // Mock secure vault storage
    console.log(`[CredentialManagementService] Stored credentials for tenant ${tenantId}, connector ${connectorId}`);
    return true;
  }
}

export class ConnectorHealthService {
  public async checkHealth(installationId: string): Promise<ConnectorHealthStatus> {
    return {
      installationId,
      connectorId: 'mock-connector-id',
      tenantId: 'mock-tenant-id',
      isHealthy: true,
      latencyMs: Math.floor(Math.random() * 200),
      lastCheckedAt: new Date()
    };
  }
}

export class SchemaTransformationService {
  public transformPayload(sourcePayload: any, targetSchema: string): any {
    // Mock mapping logic from vendor specific format to internal domain model
    return { ...sourcePayload, _transformed: true, _schema: targetSchema };
  }
}

export class ConnectorLoader {
  public loadPlugin(code: string): boolean {
    console.log(`[ConnectorLoader] Dynamically loading plugin code: ${code}`);
    return true; // Mock successful load
  }
}

export class ConnectorFactory {
  constructor(
    private readonly loader: ConnectorLoader,
    private readonly credentialsManager: CredentialManagementService
  ) {}

  public async install(tenantId: string, definition: ConnectorDefinition): Promise<InstalledConnector> {
    this.loader.loadPlugin(definition.code);
    
    return {
      installationId: crypto.randomUUID(),
      tenantId,
      connectorId: definition.connectorId,
      status: 'INSTALLED',
      isSandbox: false,
      installedAt: new Date()
    };
  }
}
