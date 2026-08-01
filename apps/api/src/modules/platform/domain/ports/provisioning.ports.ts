/**
 * Enterprise Tenant Provisioning Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for tenant onboarding persistence, CQRS read queries,
 * workspace provisioners, and resource allocation managers.
 */

import { TenantProvisioningAggregate } from '../models/provisioning.aggregate';
import { LifecycleStage, ProvisioningStatus, TenantType } from '../enums/provisioning.enums';
import { ResourceAllocation, WorkspaceId, WorkspaceTemplate } from '../value-objects/provisioning-vo';
import {
  InitializationHistoryReadModel,
  ProvisioningHistoryReadModel,
  ProvisioningStatisticsReadModel,
  ResourceAllocationsReadModel,
  TenantCatalogReadModel,
  WorkspaceCatalogReadModel,
} from '../../application/read-models/provisioning.read-models';

export const TENANT_PROVISIONING_REPOSITORY_TOKEN = Symbol('ITenantProvisioningRepository');
export const TENANT_PROVISIONING_QUERY_REPOSITORY_TOKEN = Symbol('ITenantProvisioningQueryRepository');
export const WORKSPACE_PROVISIONER_TOKEN = Symbol('IWorkspaceProvisionerPort');

export interface ITenantProvisioningRepository {
  save(provisioning: TenantProvisioningAggregate): Promise<void>;
  findById(id: string): Promise<TenantProvisioningAggregate | null>;
  findByTenantId(tenantId: string): Promise<TenantProvisioningAggregate | null>;
  findBySlug(slug: string): Promise<TenantProvisioningAggregate | null>;
  findAll(tenantType?: TenantType, stage?: LifecycleStage): Promise<TenantProvisioningAggregate[]>;
  delete(id: string): Promise<boolean>;
}

export interface ITenantProvisioningQueryRepository {
  getCatalog(tenantType?: TenantType, stage?: LifecycleStage): Promise<TenantCatalogReadModel>;

  getHistory(tenantId?: string): Promise<ProvisioningHistoryReadModel>;

  getWorkspaceCatalog(tenantId?: string): Promise<WorkspaceCatalogReadModel>;

  getResourceAllocations(tenantId?: string): Promise<ResourceAllocationsReadModel>;

  getStatistics(): Promise<ProvisioningStatisticsReadModel>;

  getInitializationHistory(tenantId?: string): Promise<InitializationHistoryReadModel>;
}

export interface IWorkspaceProvisionerPort {
  provisionWorkspace(
    tenantId: string,
    template: WorkspaceTemplate
  ): Promise<{ workspaceId: WorkspaceId; templateName: string }>;

  allocateResources(
    tenantId: string,
    tenantType: TenantType
  ): Promise<ResourceAllocation[]>;

  deallocateResources(tenantId: string): Promise<boolean>;
}
