/**
 * Enterprise Tenant Provisioning Platform - REST Controller
 *
 * Exposes production REST API endpoints for automated tenant onboarding, workspace creation,
 * resource allocation tracking, tenant suspension/resumption, and Saga provisioning audit history.
 *
 * API Base Path: /platform
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseTenantProvisioningPlatformService } from '../../application/services/provisioning-platform.services';
import {
  ProvisionTenantDto,
  ResumeTenantDto,
  SuspendTenantDto,
  TenantProvisionResponseDto,
} from '../../application/dto/provisioning.dto';
import {
  InitializationHistoryReadModel,
  ProvisioningHistoryReadModel,
  ProvisioningStatisticsReadModel,
  ResourceAllocationsReadModel,
  TenantCatalogReadModel,
  WorkspaceCatalogReadModel,
} from '../../application/read-models/provisioning.read-models';
import { LifecycleStage, TenantType } from '../../domain/enums/provisioning.enums';

@Controller('platform')
export class EnterpriseProvisioningController {
  constructor(private readonly provisioningPlatformService: EnterpriseTenantProvisioningPlatformService) {}

  /**
   * POST /platform/tenants/provision
   * Trigger automated tenant onboarding Saga workflow.
   */
  @Post('tenants/provision')
  @HttpCode(HttpStatus.CREATED)
  async provisionTenant(
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: ProvisionTenantDto
  ): Promise<TenantProvisionResponseDto> {
    const createdBy = userIdHeader || 'system';
    return this.provisioningPlatformService.provisionTenant(dto, createdBy);
  }

  /**
   * GET /platform/tenants
   * Query tenant provisioning catalog. Filterable by tenantType and stage.
   */
  @Get('tenants')
  async getTenants(
    @Query('tenantType') tenantType?: TenantType,
    @Query('stage') stage?: LifecycleStage
  ): Promise<TenantCatalogReadModel> {
    return this.provisioningPlatformService.getTenants(tenantType, stage);
  }

  /**
   * GET /platform/provisioning/history
   * Query Saga provisioning execution and audit history.
   */
  @Get('provisioning/history')
  async getHistory(
    @Query('tenantId') tenantId?: string
  ): Promise<ProvisioningHistoryReadModel> {
    return this.provisioningPlatformService.getHistory(tenantId);
  }

  /**
   * GET /platform/tenants/workspaces
   * Query workspace catalog for all or specific tenant.
   */
  @Get('tenants/workspaces')
  async getWorkspaceCatalog(
    @Query('tenantId') tenantId?: string
  ): Promise<WorkspaceCatalogReadModel> {
    return this.provisioningPlatformService.getWorkspaceCatalog(tenantId);
  }

  /**
   * GET /platform/tenants/resources
   * Query resource allocations & quota limits.
   */
  @Get('tenants/resources')
  async getResourceAllocations(
    @Query('tenantId') tenantId?: string
  ): Promise<ResourceAllocationsReadModel> {
    return this.provisioningPlatformService.getResourceAllocations(tenantId);
  }

  /**
   * GET /platform/tenants/statistics
   * Query overall tenant provisioning statistics and duration metrics.
   */
  @Get('tenants/statistics')
  async getStatistics(): Promise<ProvisioningStatisticsReadModel> {
    return this.provisioningPlatformService.getStatistics();
  }

  /**
   * GET /platform/tenants/initialization
   * Query step-by-step initialization execution logs.
   */
  @Get('tenants/initialization')
  async getInitializationHistory(
    @Query('tenantId') tenantId?: string
  ): Promise<InitializationHistoryReadModel> {
    return this.provisioningPlatformService.getInitializationHistory(tenantId);
  }

  /**
   * GET /platform/tenants/:id
   * Retrieve tenant provisioning status & details by ID or tenantId.
   */
  @Get('tenants/:id')
  async getTenantById(@Param('id') id: string): Promise<TenantProvisionResponseDto> {
    return this.provisioningPlatformService.getTenantById(id);
  }

  /**
   * POST /platform/tenants/:id/suspend
   * Suspend active tenant operations.
   */
  @Post('tenants/:id/suspend')
  @HttpCode(HttpStatus.OK)
  async suspendTenant(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: SuspendTenantDto
  ): Promise<TenantProvisionResponseDto> {
    const updatedBy = userIdHeader || 'system';
    return this.provisioningPlatformService.suspendTenant(id, dto, updatedBy);
  }

  /**
   * POST /platform/tenants/:id/resume
   * Resume suspended tenant operations.
   */
  @Post('tenants/:id/resume')
  @HttpCode(HttpStatus.OK)
  async resumeTenant(
    @Param('id') id: string,
    @Headers('x-user-id') userIdHeader: string,
    @Body() dto: ResumeTenantDto
  ): Promise<TenantProvisionResponseDto> {
    const updatedBy = userIdHeader || 'system';
    return this.provisioningPlatformService.resumeTenant(id, dto, updatedBy);
  }
}
