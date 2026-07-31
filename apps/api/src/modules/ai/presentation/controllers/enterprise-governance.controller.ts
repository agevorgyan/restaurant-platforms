/**
 * Enterprise AI Governance & Certification Platform - REST Controller
 *
 * Exposes production REST API endpoints for policy enforcement, audit trails,
 * cost controls, risk dashboards, and platform certification.
 *
 * API Base Path: /ai/governance
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EnterpriseGovernancePlatformService } from '../../application/services/governance-platform.services';
import { CreatePolicyDto, CertifyPlatformDto, PolicyResponseDto } from '../../application/dto/governance.dto';
import {
  PolicyCatalog,
  AuditHistory,
  GovernanceCostDashboard,
  RiskDashboard,
  CertificationHistoryEntry,
} from '../../application/read-models/governance.read-models';

@Controller('ai/governance')
export class EnterpriseGovernanceController {
  constructor(private readonly governanceService: EnterpriseGovernancePlatformService) {}

  /**
   * GET /ai/governance/policies
   * Query catalog of active governance policies.
   */
  @Get('policies')
  async getPolicies(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<PolicyCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.governanceService.getPolicies(tenantId);
  }

  /**
   * POST /ai/governance/policies
   * Register and activate a new governance policy.
   */
  @Post('policies')
  @HttpCode(HttpStatus.CREATED)
  async createPolicy(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreatePolicyDto
  ): Promise<PolicyResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.governanceService.createPolicy(tenantId, dto);
  }

  /**
   * GET /ai/governance/audit
   * Query immutable audit history log of AI actions.
   */
  @Get('audit')
  async getAuditHistory(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<AuditHistory> {
    const tenantId = tenantHeader || undefined;
    return this.governanceService.getAuditHistory(tenantId);
  }

  /**
   * GET /ai/governance/costs
   * Query token spend and governance cost controls dashboard.
   */
  @Get('costs')
  async getCostDashboard(): Promise<GovernanceCostDashboard> {
    return this.governanceService.getCostDashboard();
  }

  /**
   * GET /ai/governance/risks
   * Query risk assessment dashboard metrics.
   */
  @Get('risks')
  async getRiskDashboard(): Promise<RiskDashboard> {
    return this.governanceService.getRiskDashboard();
  }

  /**
   * POST /ai/governance/certify
   * Execute enterprise production certification audit of the AI Platform.
   */
  @Post('certify')
  @HttpCode(HttpStatus.OK)
  async certifyPlatform(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CertifyPlatformDto
  ): Promise<CertificationHistoryEntry> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.governanceService.certifyPlatform(tenantId, dto);
  }
}
