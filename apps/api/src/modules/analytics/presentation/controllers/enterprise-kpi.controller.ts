/**
 * Enterprise KPI Platform - REST Controller
 *
 * Exposes production REST API endpoints for KPI creation, updates, formula evaluations,
 * weighted scorecards, historical snapshots, and KPI statistics.
 *
 * API Base Path: /analytics/kpis
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseKpiPlatformService } from '../../application/services/kpi-platform.services';
import { CreateKpiDto, UpdateKpiDto, CalculateKpiDto, KpiResponseDto } from '../../application/dto/kpi.dto';
import {
  KpiCatalogReadModel,
  KpiScorecardsReadModel,
  KpiSnapshotsReadModel,
  KpiStatisticsReadModel,
} from '../../application/read-models/kpi.read-models';

@Controller('analytics/kpis')
export class EnterpriseKpiController {
  constructor(private readonly kpiService: EnterpriseKpiPlatformService) {}

  /**
   * GET /analytics/kpis
   * Query catalog of KPI definitions.
   */
  @Get()
  async getKpis(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<KpiCatalogReadModel> {
    const tenantId = tenantHeader || undefined;
    return this.kpiService.getKpiCatalog(tenantId);
  }

  /**
   * GET /analytics/kpis/scorecards
   * Query executive weighted departmental scorecards.
   */
  @Get('scorecards')
  async getKpiScorecards(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<KpiScorecardsReadModel> {
    const tenantId = tenantHeader || undefined;
    return this.kpiService.getKpiScorecards(tenantId);
  }

  /**
   * GET /analytics/kpis/snapshots
   * Query historical append-only KPI calculation snapshots.
   */
  @Get('snapshots')
  async getKpiSnapshots(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<KpiSnapshotsReadModel> {
    const tenantId = tenantHeader || undefined;
    return this.kpiService.getKpiSnapshots(tenantId);
  }

  /**
   * GET /analytics/kpis/statistics
   * Query overall KPI status and threshold statistics.
   */
  @Get('statistics')
  async getKpiStatistics(): Promise<KpiStatisticsReadModel> {
    return this.kpiService.getKpiStatistics();
  }

  /**
   * POST /analytics/kpis
   * Register a new KPI definition.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createKpi(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateKpiDto
  ): Promise<KpiResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.kpiService.createKpi(tenantId, dto);
  }

  /**
   * POST /analytics/kpis/:id/calculate
   * Evaluate KPI formula deterministically over input variables and produce snapshot.
   */
  @Post(':id/calculate')
  @HttpCode(HttpStatus.OK)
  async calculateKpi(
    @Param('id') id: string,
    @Body() dto: CalculateKpiDto
  ): Promise<KpiResponseDto> {
    return this.kpiService.calculateKpi(id, dto);
  }

  /**
   * PATCH /analytics/kpis/:id
   * Update KPI definition or lifecycle status.
   */
  @Patch(':id')
  async updateKpi(
    @Param('id') id: string,
    @Body() dto: UpdateKpiDto
  ): Promise<KpiResponseDto> {
    return this.kpiService.updateKpi(id, dto);
  }
}
