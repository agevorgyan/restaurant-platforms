import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { 
  ConnectorRegistry,
  ConnectorFactory,
  ConnectorHealthService
} from '../../application/services';
import { 
  ConnectorDefinition,
  InstalledConnector,
  ConnectorHealthStatus
} from '../../application/read-models';

@Controller('connectors')
export class EnterpriseConnectorController {
  constructor(
    private readonly registry: ConnectorRegistry,
    private readonly factory: ConnectorFactory,
    private readonly healthService: ConnectorHealthService
  ) {}

  @Get()
  async getInfo(): Promise<{ status: string; module: string }> {
    return { status: 'ONLINE', module: 'Enterprise Connector Framework' };
  }

  @Get('catalog')
  async getCatalog(): Promise<ConnectorDefinition[]> {
    return this.registry.getCatalog();
  }

  @Get(':id')
  async getConnectorById(@Param('id') id: string): Promise<ConnectorDefinition | null> {
    const connector = this.registry.getConnector(id);
    if (!connector) return null;
    return connector;
  }

  @Post('install')
  async installConnector(
    @Body() payload: { tenantId: string; connectorId: string }
  ): Promise<InstalledConnector> {
    const definition = this.registry.getConnector(payload.connectorId);
    if (!definition) throw new Error(`Connector not found: ${payload.connectorId}`);
    
    return this.factory.install(payload.tenantId, definition);
  }

  @Post('configure')
  async configureConnector(
    @Body() payload: { installationId: string; settings: any }
  ): Promise<{ status: string }> {
    // Mock configuration save
    console.log(`[EnterpriseConnectorController] Configuring installation ${payload.installationId}`);
    return { status: 'CONFIGURED' };
  }

  @Post('validate')
  async validateConfiguration(
    @Body() payload: { installationId: string }
  ): Promise<{ isValid: boolean; message?: string }> {
    // Mock validation against third party sandbox API
    return { isValid: true, message: 'Configuration validated successfully.' };
  }

  @Post('enable')
  async enableConnector(@Body() payload: { installationId: string }): Promise<{ status: string }> {
    return { status: 'ENABLED' };
  }

  @Post('disable')
  async disableConnector(@Body() payload: { installationId: string }): Promise<{ status: string }> {
    return { status: 'DISABLED' };
  }

  @Get('health/status')
  async getHealth(@Query('installationId') installationId: string): Promise<ConnectorHealthStatus> {
    return this.healthService.checkHealth(installationId);
  }
}
