/**
 * Automation Orchestration Platform — CQRS Read-Model Queries
 *
 * These query objects represent the read-side of the CQRS boundary.
 * They encapsulate the intent of each read-model request, decoupled
 * from HTTP transport and controller concerns.
 *
 * Each query is a plain value object: no side effects, no I/O.
 * The corresponding read-model handlers are implemented in the service layer.
 */

import { OrchestrationStatus, OrchestrationExecutionStatus, TriggerType } from '../../domain/enums/orchestration.enums';

// ---------------------------------------------------------------------------
// Query value objects
// ---------------------------------------------------------------------------

/**
 * Retrieves the automation catalog for a tenant.
 * Projects: AutomationCatalogView[]
 */
export class GetAutomationCatalogQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status?: OrchestrationStatus,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
    public readonly sortBy: string = 'updatedAt',
    public readonly sortOrder: 'asc' | 'desc' = 'desc',
  ) {}
}

/**
 * Retrieves execution summaries for an orchestration or across all orchestrations.
 * Projects: AutomationExecutionsView[]
 */
export class GetAutomationExecutionsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly orchestrationId?: string,
    public readonly status?: OrchestrationExecutionStatus,
    public readonly triggerType?: TriggerType,
    public readonly correlationId?: string,
    public readonly fromDate?: Date,
    public readonly toDate?: Date,
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}

/**
 * Retrieves the full DAG view of a specific orchestration definition.
 * Includes topological order and parallel groups for UI graph rendering.
 * Projects: ExecutionGraphView
 */
export class GetExecutionGraphQuery {
  constructor(
    public readonly tenantId: string,
    public readonly orchestrationId: string,
    public readonly version?: number,
  ) {}
}

/**
 * Retrieves all templates visible to the requesting tenant.
 * Includes global (tenant=null) and tenant-specific templates.
 * Projects: AutomationTemplatesView[]
 */
export class GetAutomationTemplatesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly category?: string,
    public readonly search?: string,
    public readonly includePublic: boolean = true,
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}

/**
 * Retrieves the time-ordered event timeline for a single execution.
 * Projects: ExecutionTimelineView
 */
export class GetExecutionTimelineQuery {
  constructor(
    public readonly tenantId: string,
    public readonly executionId: string,
  ) {}
}

/**
 * Retrieves aggregated execution statistics for the orchestration platform.
 * Projects: AutomationStatisticsView
 */
export class GetAutomationStatisticsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly fromDate: Date,
    public readonly toDate: Date,
  ) {}
}
