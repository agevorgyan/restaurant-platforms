/**
 * Enterprise Distributed Configuration Platform - REST Controller
 *
 * Exposes production REST API endpoints for central configuration management, draft creation,
 * publication, versioning, rollback engine, environment catalog, and propagation telemetry.
 *
 * API Base Path: /platform
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
} from '@nestjs/common';
import { EnterpriseDistributedConfigService } from '../../application/services/config-platform.services';
import {
  ConfigurationResponseDto,
  CreateConfigurationDto,
  PublishConfigurationDto,
  RollbackConfigurationDto,
  UpdateConfigurationDto,
} from '../../application/dto/config.dto';
import {
  ConfigurationCatalogReadModel,
  ConfigurationHistoryReadModel,
  ConfigurationStatisticsReadModel,
  EnvironmentCatalogReadModel,
  PropagationHistoryReadModel,
  SnapshotHistoryReadModel,
} from '../../application/read-models/config.read-models';
import {
  ConfigurationStatus,
  ConfigurationType,
  EnvironmentType,
} from '../../domain/enums/config.enums';

@Controller('platform')
export class EnterpriseConfigController {
  constructor(private readonly configPlatformService: EnterpriseDistributedConfigService) {}

  /**
   * GET /platform/configurations
   * Query central configuration catalog. Filterable by environment, type, and status.
   */
  @Get('configurations')
  async getConfigurations(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('environment') environment?: EnvironmentType,
    @Query('configType') configType?: ConfigurationType,
    @Query('status') status?: ConfigurationStatus
  ): Promise<ConfigurationCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getConfigurations(tenantId, environment, configType, status);
  }

  /**
   * GET /platform/configurations/history
   * Query configuration revision history log.
   */
  @Get('configurations/history')
  async getHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('key') key?: string
  ): Promise<ConfigurationHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getHistory(tenantId, key);
  }

  /**
   * GET /platform/configurations/propagation
   * Query propagation broadcast latency & status history.
   */
  @Get('configurations/propagation')
  async getPropagationHistory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<PropagationHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getPropagationHistory(tenantId);
  }

  /**
   * GET /platform/configurations/statistics
   * Query overall configuration statistics, checksum integrity, and distribution metrics.
   */
  @Get('configurations/statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConfigurationStatisticsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getStatistics(tenantId);
  }

  /**
   * GET /platform/configurations/snapshots
   * Query point-in-time environment configuration snapshots.
   */
  @Get('configurations/snapshots')
  async getSnapshots(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('environment') environment?: EnvironmentType
  ): Promise<SnapshotHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getSnapshots(tenantId, environment);
  }

  /**
   * GET /platform/configurations/:id
   * Retrieve single configuration by ID.
   */
  @Get('configurations/:id')
  async getConfigurationById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ConfigurationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getConfigurationById(tenantId, id);
  }

  /**
   * POST /platform/configurations
   * Register a new configuration definition in DRAFT status.
   */
  @Post('configurations')
  @HttpCode(HttpStatus.CREATED)
  async createConfiguration(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateConfigurationDto
  ): Promise<ConfigurationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const createdBy = userIdHeader || 'system';
    return this.configPlatformService.createConfiguration(tenantId, dto, createdBy);
  }

  /**
   * PATCH /platform/configurations/:id
   * Update configuration draft or create new draft revision if published.
   */
  @Patch('configurations/:id')
  async updateConfiguration(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateConfigurationDto
  ): Promise<ConfigurationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.configPlatformService.updateConfiguration(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /platform/configurations/:id/publish
   * Publish configuration version and trigger cluster propagation broadcast.
   */
  @Post('configurations/:id/publish')
  @HttpCode(HttpStatus.OK)
  async publishConfiguration(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: PublishConfigurationDto
  ): Promise<ConfigurationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const publishedBy = userIdHeader || 'system';
    return this.configPlatformService.publishConfiguration(tenantId, id, dto, publishedBy);
  }

  /**
   * POST /platform/configurations/:id/rollback
   * Rollback configuration to a previously published revision.
   */
  @Post('configurations/:id/rollback')
  @HttpCode(HttpStatus.OK)
  async rollbackConfiguration(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: RollbackConfigurationDto
  ): Promise<ConfigurationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const rolledBackBy = userIdHeader || 'system';
    return this.configPlatformService.rollbackConfiguration(tenantId, id, dto, rolledBackBy);
  }

  /**
   * GET /platform/environments
   * Query environment catalog and environment-wide configuration counts.
   */
  @Get('environments')
  async getEnvironments(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<EnvironmentCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.configPlatformService.getEnvironments(tenantId);
  }
}
