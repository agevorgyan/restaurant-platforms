/**
 * Enterprise Connector Platform - REST Controller
 *
 * Exposes production-grade REST API endpoints for connector lifecycle management,
 * capability discovery, health monitoring, versioning, and statistics.
 *
 * API Base Path: /integrations/connectors
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectorService,
  HealthService,
  ConnectorRegistryService,
} from '../../application/services/connector-platform.services';
import {
  CreateConnectorDto,
  ConfigureConnectorDto,
  ConnectConnectorDto,
  DisconnectConnectorDto,
  PublishVersionDto,
  ConnectorQueryDto,
  ConnectorResponseDto,
} from '../../application/dto/connector.dto';
import {
  ConnectorCatalog,
  ConnectorHealthDashboard,
  ConnectorStatistics,
  CapabilityCatalog,
  ConnectorInventory,
  ConnectorDefinition,
  ConnectorHealthStatus,
} from '../../application/read-models/connector.read-models';

@Controller('integrations/connectors')
export class EnterpriseConnectorController {
  constructor(
    private readonly connectorService: ConnectorService,
    private readonly healthService: HealthService,
    private readonly registryService: ConnectorRegistryService
  ) {}

  /**
   * GET /integrations/connectors
   * List connectors with filtering by type, status, search, and tenant.
   */
  @Get()
  async listConnectors(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: any,
    @Query('status') status?: any,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<ConnectorResponseDto[]> {
    const tenantId = tenantHeader || 'tenant-default';
    const query: ConnectorQueryDto = {
      tenantId,
      type,
      status,
      search,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.connectorService.listConnectors(query);
  }

  /**
   * GET /integrations/connectors/health
   * Retrieve real-time health dashboard and connector health states.
   */
  @Get('health')
  async getHealthDashboard(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConnectorHealthDashboard> {
    const tenantId = tenantHeader || undefined;
    return this.healthService.getHealthDashboard(tenantId);
  }

  /**
   * GET /integrations/connectors/health/status
   * Trigger and retrieve instant health status check for a specific connector.
   */
  @Get('health/status')
  async getHealthStatus(
    @Query('installationId') installationId: string
  ): Promise<ConnectorHealthStatus> {
    return this.healthService.checkHealth(installationId);
  }

  /**
   * GET /integrations/connectors/statistics
   * Retrieve aggregate metrics and system statistics.
   */
  @Get('statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConnectorStatistics> {
    const tenantId = tenantHeader || undefined;
    return this.connectorService.getStatistics(tenantId);
  }

  /**
   * GET /integrations/connectors/catalog
   * Retrieve available connector definitions and templates.
   */
  @Get('catalog')
  async getCatalog(@Query() query: ConnectorQueryDto): Promise<ConnectorDefinition[]> {
    return this.registryService.getCatalog(query);
  }

  /**
   * GET /integrations/connectors/capabilities
   * Discover capabilities mapped across all connectors.
   */
  @Get('capabilities')
  async getCapabilityCatalog(): Promise<CapabilityCatalog> {
    return this.registryService.getCapabilityCatalog();
  }

  /**
   * GET /integrations/connectors/inventory
   * Retrieve tenant connector inventory.
   */
  @Get('inventory')
  async getTenantInventory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConnectorInventory> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.registryService.getInventory(tenantId);
  }

  /**
   * GET /integrations/connectors/:id
   * Get connector details by ID.
   */
  @Get(':id')
  async getConnectorById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || undefined;
    return this.connectorService.getConnectorById(id, tenantId);
  }

  /**
   * POST /integrations/connectors
   * Register a new connector in Draft state.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerConnector(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateConnectorDto
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.connectorService.registerConnector(tenantId, dto);
  }

  /**
   * PATCH /integrations/connectors/:id
   * Configure settings, endpoints, and credential references.
   */
  @Patch(':id')
  async configureConnector(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ConfigureConnectorDto
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.connectorService.configureConnector(id, tenantId, dto);
  }

  /**
   * POST /integrations/connectors/:id/connect
   * Connect connector instance to target external system endpoint.
   */
  @Post(':id/connect')
  @HttpCode(HttpStatus.OK)
  async connectConnector(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ConnectConnectorDto
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.connectorService.connectConnector(id, tenantId, dto);
  }

  /**
   * POST /integrations/connectors/:id/disconnect
   * Disconnect connector instance.
   */
  @Post(':id/disconnect')
  @HttpCode(HttpStatus.OK)
  async disconnectConnector(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: DisconnectConnectorDto
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.connectorService.disconnectConnector(id, tenantId, dto);
  }

  /**
   * POST /integrations/connectors/:id/version
   * Publish a new SemVer version for a connector.
   */
  @Post(':id/version')
  @HttpCode(HttpStatus.OK)
  async publishVersion(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: PublishVersionDto
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.connectorService.publishVersion(id, tenantId, dto);
  }

  /**
   * POST /integrations/connectors/:id/disable
   * Disable a connector.
   */
  @Post(':id/disable')
  @HttpCode(HttpStatus.OK)
  async disableConnector(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() payload: { reason?: string }
  ): Promise<ConnectorResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const reason = payload?.reason || 'Disabled via administrative API action';
    return this.connectorService.disableConnector(id, tenantId, reason);
  }
}
