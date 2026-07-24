import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { 
  ConnectorDefinition, 
  PublishedDataset, 
  ConnectorHealth 
} from '../../application/read-models';
import { 
  ConnectorRegistry, 
  DatasetPublisher,
  ConnectorHealthService,
  SchemaManagementService
} from '../../application/services';

@Controller('enterprise/connectors')
export class EnterpriseBIController {
  constructor(
    private readonly registry: ConnectorRegistry,
    private readonly publisher: DatasetPublisher,
    private readonly healthService: ConnectorHealthService,
    private readonly schemaService: SchemaManagementService
  ) {}

  @Get()
  async getConnectors(): Promise<ConnectorDefinition[]> {
    return this.registry.getSupportedConnectors();
  }

  @Get('datasets')
  async getPublishedDatasets(@Query('connectorId') connectorId: string): Promise<PublishedDataset[]> {
    // Mock returning a list of published datasets
    return [{
      publicationId: 'pub-1',
      datasetReference: 'Executive_Dashboard_Dataset',
      connectorId: connectorId || 'conn-powerbi',
      schemaVersion: '1.0.0',
      publishedAt: new Date(),
      accessUrl: `https://api.restaurant-saas.com/enterprise/connectors/${connectorId || 'conn-powerbi'}/datasets/Executive_Dashboard_Dataset`,
      isPublic: false
    }];
  }

  @Post('publish')
  async publishDataset(
    @Body() payload: { connectorId: string, datasetReference: string }
  ): Promise<PublishedDataset> {
    const mockConfig = {
      configId: 'cfg-1',
      connectorId: payload.connectorId,
      targetId: 'default-org',
      accessPolicy: 'TENANT_ISOLATED',
      apiTokens: ['tok-123'],
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return this.publisher.publishDataset(
      payload.connectorId, 
      payload.datasetReference, 
      mockConfig
    );
  }

  @Get('health')
  async getConnectorHealth(@Query('connectorId') connectorId: string): Promise<ConnectorHealth> {
    return this.healthService.checkHealth(connectorId || 'conn-powerbi');
  }

  @Get('schema')
  async getSchema(
    @Query('version') version: string,
    @Query('dataset') dataset: string
  ): Promise<Record<string, string>> {
    return this.schemaService.getSchemaDefinition(version || '1.0.0', dataset || 'Generic');
  }
}
