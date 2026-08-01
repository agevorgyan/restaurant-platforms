/**
 * Enterprise Platform Health & Operations Platform - REST Controller
 *
 * Exposes production REST API endpoints for platform health dashboards, service catalog,
 * directed dependency graph, maintenance window scheduling, SLA availability metrics,
 * synthetic checks, and heartbeat monitoring.
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
import { EnterprisePlatformHealthService } from '../../application/services/health-platform.services';
import {
  AvailabilityResponseDto,
  DependencyGraphResponseDto,
  ExecuteSyntheticCheckDto,
  HealthCheckResponseDto,
  MaintenanceResponseDto,
  RecordHeartbeatDto,
  RegisterServiceDto,
  ScheduleMaintenanceDto,
  ServiceResponseDto,
  UpdateServiceStatusDto,
} from '../../application/dto/health.dto';
import {
  AvailabilityHistoryReadModel,
  DependencyMapReadModel,
  HealthDashboardReadModel,
  HealthStatisticsReadModel,
  MaintenanceHistoryReadModel,
  ServiceCatalogReadModel,
} from '../../application/read-models/health.read-models';
import { HealthType, ServiceStatus } from '../../domain/enums/health.enums';

@Controller('platform')
export class EnterpriseHealthController {
  constructor(private readonly healthPlatformService: EnterprisePlatformHealthService) {}

  /**
   * GET /platform/health
   * Query operational health dashboard and aggregated system health status.
   */
  @Get('health')
  async getHealthDashboard(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<HealthDashboardReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getHealthDashboard(tenantId);
  }

  /**
   * GET /platform/services
   * Query registered platform service catalog. Filterable by type and status.
   */
  @Get('services')
  async getServices(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('healthType') healthType?: HealthType,
    @Query('status') status?: ServiceStatus
  ): Promise<ServiceCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getServices(tenantId, healthType, status);
  }

  /**
   * GET /platform/services/:id
   * Retrieve single platform service health definition by ID.
   */
  @Get('services/:id')
  async getServiceById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ServiceResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getServiceById(tenantId, id);
  }

  /**
   * POST /platform/services
   * Register a new service in the platform health registry.
   */
  @Post('services')
  @HttpCode(HttpStatus.CREATED)
  async registerService(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: RegisterServiceDto
  ): Promise<ServiceResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const registeredBy = userIdHeader || 'system';
    return this.healthPlatformService.registerService(tenantId, dto, registeredBy);
  }

  /**
   * PATCH /platform/services/:id
   * Update service status manually or trigger maintenance override.
   */
  @Patch('services/:id')
  async updateServiceStatus(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateServiceStatusDto
  ): Promise<ServiceResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.healthPlatformService.updateServiceStatus(tenantId, id, dto, updatedBy);
  }

  /**
   * GET /platform/dependencies
   * Query directed dependency graph for platform services.
   */
  @Get('dependencies')
  async getDependencies(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<DependencyMapReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getDependencyMap(tenantId);
  }

  /**
   * POST /platform/maintenance
   * Schedule a maintenance window and apply maintenance status overrides.
   */
  @Post('maintenance')
  @HttpCode(HttpStatus.CREATED)
  async scheduleMaintenance(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ScheduleMaintenanceDto
  ): Promise<MaintenanceResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.scheduleMaintenance(tenantId, dto);
  }

  /**
   * GET /platform/maintenance
   * Query maintenance window history and scheduled maintenance windows.
   */
  @Get('maintenance')
  async getMaintenanceHistory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<MaintenanceHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getMaintenanceHistory(tenantId);
  }

  /**
   * GET /platform/availability
   * Query availability history logs and SLA target compliance.
   */
  @Get('availability')
  async getAvailabilityHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('serviceId') serviceId?: string
  ): Promise<AvailabilityHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getAvailabilityHistory(tenantId, serviceId);
  }

  /**
   * POST /platform/heartbeat
   * Ingest service heartbeat pulse and update latest heartbeat timestamp.
   */
  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  async recordHeartbeat(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: RecordHeartbeatDto
  ): Promise<{ status: string; receivedAt: string }> {
    const tenantId = tenantHeader || 'tenant-default';
    await this.healthPlatformService.recordHeartbeat(tenantId, dto);
    return { status: 'RECEIVED', receivedAt: new Date().toISOString() };
  }

  /**
   * POST /platform/health/synthetic
   * Execute synthetic or dependency check against specified target service.
   */
  @Post('health/synthetic')
  @HttpCode(HttpStatus.OK)
  async executeSyntheticCheck(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteSyntheticCheckDto
  ): Promise<HealthCheckResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.executeSyntheticCheck(tenantId, dto);
  }

  /**
   * GET /platform/statistics
   * Query overall platform health statistics, check counts, and uptime.
   */
  @Get('statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<HealthStatisticsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.healthPlatformService.getStatistics(tenantId);
  }
}
