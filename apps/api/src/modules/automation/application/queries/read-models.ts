export class WorkflowCatalogReadModel {
  id!: string;
  name!: string;
  version!: string;
  status!: string;
  stepCount!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkflowExecutionsReadModel {
  instanceId!: string;
  workflowId!: string;
  version!: string;
  status!: string;
  startedAt!: Date;
  updatedAt!: Date;
  currentSteps!: string[];
}

export class WorkflowStatisticsReadModel {
  totalExecutions!: number;
  completedExecutions!: number;
  failedExecutions!: number;
  activeExecutions!: number;
  averageDurationSeconds!: number;
}

export class PendingApprovalsReadModel {
  instanceId!: string;
  stepId!: string;
  roleId?: string;
  userId?: string;
  requestedAt!: Date;
}

export class WorkflowHistoryReadModel {
  instanceId!: string;
  timeline!: Array<{ event: string; at: Date }>;
}

export class FailedWorkflowsReadModel {
  instanceId!: string;
  workflowId!: string;
  version!: string;
  failedAt!: Date;
  reason!: string;
}
