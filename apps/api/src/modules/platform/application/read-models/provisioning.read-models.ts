/**
 * Enterprise Tenant Provisioning Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections for tenant catalog, provisioning history, workspace catalog,
 * resource allocations, provisioning statistics, and initialization step logs.
 */

import {
  InitializationStatus,
  LifecycleStage,
  ProvisioningStatus,
  ResourceType,
  TenantType,
} from '../../domain/enums/provisioning.enums';

export interface TenantSummaryReadModel {
  id: string;
  tenantId: string;
  tenantSlug: string;
  tenantType: TenantType;
  stage: LifecycleStage;
  status: ProvisioningStatus;
  companyName: string;
  adminEmail: string;
  workspaceId?: string;
  templateName: string;
  executedStepsCount: number;
  allocatedResourcesCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantCatalogReadModel {
  totalTenants: number;
  tenants: TenantSummaryReadModel[];
}

export interface ProvisioningHistoryLogEntry {
  logId: string;
  provisionId: string;
  tenantId: string;
  tenantSlug: string;
  status: ProvisioningStatus;
  stage: LifecycleStage;
  durationMs: number;
  failureReason?: string;
  timestamp: string;
}

export interface ProvisioningHistoryReadModel {
  tenantId?: string;
  totalLogs: number;
  history: ProvisioningHistoryLogEntry[];
}

export interface WorkspaceSummaryReadModel {
  workspaceId: string;
  tenantId: string;
  tenantSlug: string;
  templateName: string;
  defaultModules: string[];
  createdAt: string;
}

export interface WorkspaceCatalogReadModel {
  tenantId?: string;
  totalWorkspaces: number;
  workspaces: WorkspaceSummaryReadModel[];
}

export interface ResourceAllocationItem {
  tenantId: string;
  resourceType: ResourceType;
  quotaLimit: number;
  connectionString?: string;
  isAllocated: boolean;
}

export interface ResourceAllocationsReadModel {
  tenantId?: string;
  totalAllocations: number;
  allocations: ResourceAllocationItem[];
}

export interface ProvisioningStatisticsReadModel {
  totalTenantsProvisioned: number;
  activeTenantsCount: number;
  suspendedTenantsCount: number;
  byTenantType: Record<TenantType, number>;
  byStage: Record<LifecycleStage, number>;
  byStatus: Record<ProvisioningStatus, number>;
  averageProvisioningDurationMs: number;
  rollbackRatePercentage: number;
}

export interface InitializationStepLogEntry {
  stepName: string;
  tenantId: string;
  status: InitializationStatus;
  executionTimeMs: number;
  compensationName?: string;
  errorMessage?: string;
  timestamp: string;
}

export interface InitializationHistoryReadModel {
  tenantId?: string;
  totalStepsExecuted: number;
  steps: InitializationStepLogEntry[];
}
