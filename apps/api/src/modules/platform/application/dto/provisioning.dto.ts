/**
 * Enterprise Tenant Provisioning Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query DTOs for REST presentation layer validation.
 */

import {
  LifecycleStage,
  ProvisioningStatus,
  ResourceType,
  TenantType,
} from '../../domain/enums/provisioning.enums';

export interface ProvisionTenantDto {
  tenantSlug: string;
  tenantType: TenantType;
  companyName: string;
  adminEmail: string;
  region?: string;
  timezone?: string;
  customTemplateName?: string;
}

export interface SuspendTenantDto {
  reason: string;
}

export interface ResumeTenantDto {
  reason?: string;
}

export interface RetryProvisioningDto {
  fromStep?: string;
}

export interface ResourceAllocationDto {
  resourceType: ResourceType;
  quotaLimit: number;
  connectionString?: string;
  isAllocated: boolean;
}

export interface TenantProvisionResponseDto {
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
  allocatedResources: ResourceAllocationDto[];
  initializedModules: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceResponseDto {
  workspaceId: string;
  tenantId: string;
  tenantSlug: string;
  templateName: string;
  defaultModules: string[];
  createdAt: string;
}

export interface ResourceAllocationResponseDto {
  tenantId: string;
  allocations: ResourceAllocationDto[];
  totalAllocationsCount: number;
}

export interface ProvisioningHistoryResponseDto {
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
