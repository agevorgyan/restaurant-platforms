import { 
  ConnectorDefinition, 
  ConnectorConfiguration, 
  PublishedDataset, 
  ConnectorHealth 
} from '../read-models';

export class ConnectorRegistry {
  public getSupportedConnectors(): ConnectorDefinition[] {
    return [
      {
        connectorId: 'conn-powerbi',
        name: 'Power BI Integration',
        type: 'POWER_BI',
        description: 'Direct OData feed for Power BI workspaces.',
        supportedSchemas: ['1.0.0']
      },
      {
        connectorId: 'conn-tableau',
        name: 'Tableau Integration',
        type: 'TABLEAU',
        description: 'Web Data Connector for Tableau Server.',
        supportedSchemas: ['1.0.0']
      }
    ];
  }
}

export class AccessControlService {
  public validateAccessPolicy(config: ConnectorConfiguration, requestedDataset: string): boolean {
    // Mock access control - ensuring read-only tenant isolation
    if (config.accessPolicy !== 'TENANT_ISOLATED') return false;
    return true;
  }
}

export class SchemaManagementService {
  public getSchemaDefinition(version: string, dataset: string): Record<string, string> {
    return {
      id: 'uuid',
      metric_value: 'float',
      dimension: 'string',
      recorded_at: 'timestamp'
    };
  }
}

export class DatasetPublisher {
  constructor(
    private readonly schemaService: SchemaManagementService,
    private readonly accessService: AccessControlService
  ) {}

  public async publishDataset(
    connectorId: string, 
    datasetReference: string, 
    config: ConnectorConfiguration
  ): Promise<PublishedDataset> {
    
    if (!this.accessService.validateAccessPolicy(config, datasetReference)) {
      throw new Error('Access denied by policy.');
    }

    return {
      publicationId: crypto.randomUUID(),
      datasetReference,
      connectorId,
      schemaVersion: '1.0.0',
      publishedAt: new Date(),
      accessUrl: `https://api.restaurant-saas.com/enterprise/connectors/${connectorId}/datasets/${datasetReference}`,
      isPublic: false
    };
  }
}

export class ConnectorHealthService {
  public checkHealth(connectorId: string): ConnectorHealth {
    return {
      connectorId,
      status: 'ACTIVE',
      lastPingAt: new Date(),
      uptimePercentage: 99.9,
      errorCountLast24h: 0
    };
  }
}
