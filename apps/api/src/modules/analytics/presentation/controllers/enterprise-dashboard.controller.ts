/**
 * Enterprise Dashboard Platform - REST Controller
 *
 * Exposes production REST API endpoints for dashboard catalog management, template instantiation,
 * widget definitions, personalization profiles, real-time refresh execution, and telemetry.
 *
 * API Base Path: /analytics
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
import { EnterpriseDashboardPlatformService } from '../../application/services/dashboard-platform.services';
import {
  AddWidgetDto,
  CreateDashboardDto,
  DashboardRefreshResponseDto,
  DashboardResponseDto,
  RefreshDashboardDto,
  SavePersonalizationDto,
  UpdateDashboardDto,
} from '../../application/dto/dashboard.dto';
import {
  DashboardCatalogReadModel,
  DashboardStatisticsReadModel,
  DashboardUsageReadModel,
  PersonalizationProfilesReadModel,
  RefreshHistoryReadModel,
  UserDashboardPersonalization,
  WidgetCatalogReadModel,
} from '../../application/read-models/dashboard.read-models';
import { DashboardStatus, DashboardType } from '../../domain/enums/dashboard.enums';

@Controller('analytics')
export class EnterpriseDashboardController {
  constructor(private readonly dashboardService: EnterpriseDashboardPlatformService) {}

  /**
   * GET /analytics/dashboards
   * Query catalog of dashboards for tenant. Filterable by type and status.
   */
  @Get('dashboards')
  async getDashboards(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: DashboardType,
    @Query('status') status?: DashboardStatus
  ): Promise<DashboardCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.dashboardService.getDashboards(tenantId, type, status);
  }

  /**
   * GET /analytics/dashboards/statistics
   * Get overall tenant dashboard statistics and type distribution.
   */
  @Get('dashboards/statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<DashboardStatisticsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.dashboardService.getDashboardStatistics(tenantId);
  }

  /**
   * GET /analytics/dashboards/usage
   * Get dashboard usage analytics and view/refresh metrics.
   */
  @Get('dashboards/usage')
  async getUsage(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<DashboardUsageReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.dashboardService.getDashboardUsage(tenantId);
  }

  /**
   * GET /analytics/dashboards/history
   * Get refresh history log for audit and latency tracking.
   */
  @Get('dashboards/history')
  async getRefreshHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('limit') limit?: number
  ): Promise<RefreshHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    const limitNum = limit ? Number(limit) : 50;
    return this.dashboardService.getRefreshHistory(tenantId, limitNum);
  }

  /**
   * GET /analytics/dashboards/:id
   * Retrieve single dashboard definition with layout, theme, widgets, and user personalization overlay.
   */
  @Get('dashboards/:id')
  async getDashboardById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string,
    @Headers('x-user-id') userIdHeader?: string,
    @Headers('x-user-roles') rolesHeader?: string
  ): Promise<DashboardResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const userId = userIdHeader || undefined;
    const userRoles = rolesHeader ? rolesHeader.split(',') : undefined;

    return this.dashboardService.getDashboardById(tenantId, id, userId, userRoles);
  }

  /**
   * POST /analytics/dashboards
   * Create a new custom dashboard or instantiate from template.
   */
  @Post('dashboards')
  @HttpCode(HttpStatus.CREATED)
  async createDashboard(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateDashboardDto
  ): Promise<DashboardResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const createdBy = userIdHeader || 'system';
    return this.dashboardService.createDashboard(tenantId, dto, createdBy);
  }

  /**
   * PATCH /analytics/dashboards/:id
   * Update dashboard metadata, layout, theme, or lifecycle status (publishing/archiving).
   */
  @Patch('dashboards/:id')
  async updateDashboard(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateDashboardDto
  ): Promise<DashboardResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.dashboardService.updateDashboard(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /analytics/dashboards/:id/refresh
   * Trigger immediate refresh of dashboard data or specific widgets.
   */
  @Post('dashboards/:id/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshDashboard(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto?: RefreshDashboardDto
  ): Promise<DashboardRefreshResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.dashboardService.refreshDashboard(tenantId, id, dto);
  }

  /**
   * GET /analytics/widgets
   * Query catalog of available widgets in the Widget Library.
   */
  @Get('widgets')
  async getWidgetCatalog(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('widgetType') widgetType?: string
  ): Promise<WidgetCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.dashboardService.getWidgetCatalog(tenantId, widgetType);
  }

  /**
   * POST /analytics/widgets (or POST /analytics/dashboards/:id/widgets)
   * Create and append a widget definition to a target dashboard.
   */
  @Post('widgets')
  @HttpCode(HttpStatus.CREATED)
  async addWidgetToDashboard(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Query('dashboardId') queryDashboardId: string,
    @Body() dto: AddWidgetDto
  ): Promise<DashboardResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    const dashboardId = queryDashboardId || dto.customProps?.dashboardId as string;
    return this.dashboardService.addWidget(tenantId, dashboardId, dto, updatedBy);
  }

  /**
   * POST /analytics/dashboards/:id/widgets
   * Endpoint variant to add widget directly to specified dashboard URL.
   */
  @Post('dashboards/:id/widgets')
  @HttpCode(HttpStatus.CREATED)
  async addWidgetToDashboardPath(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: AddWidgetDto
  ): Promise<DashboardResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.dashboardService.addWidget(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /analytics/dashboards/:id/personalization
   * Save user personalization profile (hidden widgets, custom grid placements, theme overrides).
   */
  @Post('dashboards/:id/personalization')
  @HttpCode(HttpStatus.OK)
  async savePersonalization(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: SavePersonalizationDto
  ): Promise<UserDashboardPersonalization> {
    const tenantId = tenantHeader || 'tenant-default';
    const userId = userIdHeader || 'user-default';
    return this.dashboardService.savePersonalization(tenantId, userId, id, dto);
  }

  /**
   * GET /analytics/personalization
   * Get all user personalization profiles for active tenant.
   */
  @Get('personalization')
  async getUserPersonalizations(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string
  ): Promise<PersonalizationProfilesReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    const userId = userIdHeader || 'user-default';
    return this.dashboardService.getPersonalizationProfiles(tenantId, userId);
  }
}
