export interface WorkflowExecutionHistory {
  tenantId: string;
  executionId: string;
  workflowId: string;
  workflowName: string;
  status: 'CREATED' | 'RUNNING' | 'WAITING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  totalSteps: number;
  completedSteps: number;
}

export interface WorkflowStatistics {
  tenantId: string;
  period: string; // e.g. '2023-10'
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDurationMs: number;
}

export interface RegisteredTools {
  tenantId: string; // Or null if global
  tools: Array<{
    toolId: string;
    name: string;
    description: string;
    type: string;
    status: 'REGISTERED' | 'AVAILABLE' | 'DISABLED' | 'DEPRECATED';
    requiresApproval: boolean;
  }>;
}

export interface PendingApprovals {
  tenantId: string;
  approvals: Array<{
    executionId: string;
    workflowId: string;
    stepId: string;
    requestedAt: Date;
    details: string;
  }>;
}

export interface WorkflowHealth {
  tenantId: string;
  activeExecutions: number;
  suspendedExecutions: number;
  failedExecutionsLastHour: number;
  averageToolLatencyMs: number;
}
