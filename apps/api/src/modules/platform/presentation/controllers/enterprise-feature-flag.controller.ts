/**
 * Enterprise Feature Flag Platform - REST Controller
 *
 * Exposes production REST API endpoints for feature flag catalog, draft registration,
 * deterministic evaluations, percentage/canary rollouts, A/B experiments, emergency kill switches,
 * and evaluation telemetry.
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
import { EnterpriseFeatureFlagPlatformService } from '../../application/services/feature-flag-platform.services';
import {
  CreateFeatureFlagDto,
  EvaluateFeatureDto,
  EvaluationResultResponseDto,
  FeatureFlagResponseDto,
  RolloutResponseDto,
  TriggerKillSwitchDto,
  UpdateFeatureFlagDto,
  UpdateRolloutDto,
} from '../../application/dto/feature-flag.dto';
import {
  AudienceCatalogReadModel,
  EvaluationHistoryReadModel,
  ExperimentCatalogReadModel,
  FeatureCatalogReadModel,
  FeatureStatisticsReadModel,
  RolloutHistoryReadModel,
} from '../../application/read-models/feature-flag.read-models';
import { FeatureStatus, FlagType } from '../../domain/enums/feature-flag.enums';

@Controller('platform')
export class EnterpriseFeatureFlagController {
  constructor(private readonly featurePlatformService: EnterpriseFeatureFlagPlatformService) {}

  /**
   * GET /platform/features
   * Query central feature flag catalog. Filterable by flagType and status.
   */
  @Get('features')
  async getFeatures(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('flagType') flagType?: FlagType,
    @Query('status') status?: FeatureStatus
  ): Promise<FeatureCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.featurePlatformService.getFeatures(tenantId, flagType, status);
  }

  /**
   * GET /platform/features/history
   * Query rollout history log for platform feature flags.
   */
  @Get('features/history')
  async getRolloutHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('key') key?: string
  ): Promise<RolloutHistoryReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.featurePlatformService.getRolloutHistory(tenantId, key);
  }

  /**
   * GET /platform/features/statistics
   * Query feature flag evaluation statistics, active flags count, and cache hit ratios.
   */
  @Get('features/statistics')
  async getStatistics(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<FeatureStatisticsReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.featurePlatformService.getStatistics(tenantId);
  }

  /**
   * GET /platform/features/:id
   * Retrieve single feature flag definition by ID.
   */
  @Get('features/:id')
  async getFeatureById(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<FeatureFlagResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.featurePlatformService.getFeatureById(tenantId, id);
  }

  /**
   * POST /platform/features
   * Register a new feature flag definition in DRAFT status.
   */
  @Post('features')
  @HttpCode(HttpStatus.CREATED)
  async createFeature(
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: CreateFeatureFlagDto
  ): Promise<FeatureFlagResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const createdBy = userIdHeader || 'system';
    return this.featurePlatformService.createFeature(tenantId, dto, createdBy);
  }

  /**
   * PATCH /platform/features/:id
   * Update feature flag targeting rules, status, or description.
   */
  @Patch('features/:id')
  async updateFeature(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateFeatureFlagDto
  ): Promise<FeatureFlagResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.featurePlatformService.updateFeature(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /platform/features/evaluate
   * (or POST /platform/features/:id/evaluate)
   * Evaluate feature flag deterministically against provided evaluation context.
   */
  @Post('features/evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateFeature(
    @Body() dto: EvaluateFeatureDto
  ): Promise<EvaluationResultResponseDto> {
    return this.featurePlatformService.evaluateFeature(dto);
  }

  @Post('features/:id/evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluateFeatureById(
    @Param('id') id: string,
    @Body() dto: EvaluateFeatureDto
  ): Promise<EvaluationResultResponseDto> {
    return this.featurePlatformService.evaluateFeature(dto);
  }

  /**
   * POST /platform/features/:id/rollout
   * Update gradual or percentage rollout policy for target feature flag.
   */
  @Post('features/:id/rollout')
  @HttpCode(HttpStatus.OK)
  async updateRollout(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: UpdateRolloutDto
  ): Promise<RolloutResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const updatedBy = userIdHeader || 'system';
    return this.featurePlatformService.updateRollout(tenantId, id, dto, updatedBy);
  }

  /**
   * POST /platform/features/:id/kill-switch
   * Trigger emergency kill switch immediately disabling feature evaluation.
   */
  @Post('features/:id/kill-switch')
  @HttpCode(HttpStatus.OK)
  async triggerKillSwitch(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: TriggerKillSwitchDto
  ): Promise<FeatureFlagResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const activatedBy = userIdHeader || 'system';
    return this.featurePlatformService.triggerKillSwitch(tenantId, id, dto, activatedBy);
  }

  /**
   * GET /platform/experiments
   * Query A/B experimentation catalog and variant splits.
   */
  @Get('experiments')
  async getExperiments(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<ExperimentCatalogReadModel> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.featurePlatformService.getExperimentCatalog(tenantId);
  }
}
