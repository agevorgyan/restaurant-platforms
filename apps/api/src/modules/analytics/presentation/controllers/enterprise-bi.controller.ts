/**
 * Enterprise Business Intelligence Platform - REST Controller
 *
 * Base Path: /analytics/bi
 * Exposes production REST API endpoints for OLAP cubes, multidimensional queries,
 * drill operations, historical execution logs, statistics, and dimension catalogs.
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseBiPlatformService } from '../../application/services/bi-platform.services';
import { CreateCubeDto, ExecuteBiQueryDto, CubeResponseDto, BiQueryResultDto } from '../../application/dto/bi.dto';
import {
  BusinessCubesReadModel,
  DimensionCatalogReadModel,
  MeasureCatalogReadModel,
  AnalyticalHistoryReadModel,
  CubeStatisticsReadModel,
} from '../../application/read-models/bi.read-models';
import { AnalysisType, CubeStatus } from '../../domain/enums/bi.enums';

@Controller('analytics/bi')
export class EnterpriseBiController {
  constructor(private readonly biService: EnterpriseBiPlatformService) {}

  /**
   * GET /analytics/bi/cubes
   * Retrieve list of OLAP Cubes for tenant.
   */
  @Get('cubes')
  async getCubes(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('analysisType') analysisType?: AnalysisType,
    @Query('status') status?: CubeStatus
  ): Promise<BusinessCubesReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.biService.getCubes(tenantId, analysisType, status);
  }

  /**
   * POST /analytics/bi/cubes
   * Create and build a new OLAP Cube.
   */
  @Post('cubes')
  @HttpCode(HttpStatus.CREATED)
  async createCube(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateCubeDto
  ): Promise<CubeResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.biService.createCube(tenantId, dto);
  }

  /**
   * POST /analytics/bi/query
   * Execute an analytical query (slice, dice, pivot, drill-down/through/up).
   */
  @Post('query')
  @HttpCode(HttpStatus.OK)
  async executeQuery(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteBiQueryDto
  ): Promise<BiQueryResultDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.biService.executeQuery(tenantId, dto);
  }

  /**
   * GET /analytics/bi/history
   * Retrieve immutable analytical query execution history.
   */
  @Get('history')
  async getAnalyticalHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('limit') limit?: number
  ): Promise<AnalyticalHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    const limitNum = limit ? Number(limit) : 50;
    return this.biService.getAnalyticalHistory(tenantId, limitNum);
  }

  /**
   * GET /analytics/bi/statistics
   * Retrieve OLAP cube statistics and query performance metrics.
   */
  @Get('statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<CubeStatisticsReadModel> {
    const tenantId = tenantHeader || undefined;
    return this.biService.getCubeStatistics(tenantId);
  }

  /**
   * GET /analytics/bi/dimensions
   * Retrieve dimension catalog and supported hierarchy metadata.
   */
  @Get('dimensions')
  async getDimensions(): Promise<DimensionCatalogReadModel> {
    return this.biService.getDimensionCatalog();
  }

  /**
   * GET /analytics/bi/measures
   * Retrieve measure catalog and supported business measures.
   */
  @Get('measures')
  async getMeasures(): Promise<MeasureCatalogReadModel> {
    return this.biService.getMeasureCatalog();
  }
}
