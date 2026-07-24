export interface WorkflowStepDefinition {
  stepId: string;
  name: string;
  type: 'TASK' | 'COMPENSATION' | 'WAIT' | 'APPROVAL' | 'CONDITION';
  actionRef: string;
  nextStepId?: string;
  compensatingStepId?: string;
  timeoutMs?: number;
}

export interface WorkflowDefinition {
  definitionId: string;
  name: string;
  type: 'BUSINESS' | 'SAGA' | 'APPROVAL' | 'SCHEDULED';
  version: number;
  trigger: string;
  steps: WorkflowStepDefinition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowInstance {
  instanceId: string;
  definitionId: string;
  tenantId: string;
  status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'COMPENSATING' | 'COMPENSATED';
  currentStepId?: string;
  context: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
}

export interface WorkflowExecution {
  executionId: string;
  instanceId: string;
  stepId: string;
  status: 'STARTED' | 'COMPLETED' | 'FAILED' | 'COMPENSATED';
  result?: any;
  error?: string;
  startedAt: Date;
  endedAt?: Date;
}

export interface WorkflowHistory {
  instanceId: string;
  events: {
    eventType: string;
    timestamp: Date;
    details: any;
  }[];
}

export interface WorkflowMetrics {
  definitionId: string;
  totalStarted: number;
  totalCompleted: number;
  totalFailed: number;
  totalCompensated: number;
  averageDurationMs: number;
}

export interface FailedWorkflow {
  instanceId: string;
  definitionId: string;
  failedStepId: string;
  errorMessage: string;
  failedAt: Date;
  compensationStatus: 'NONE' | 'PENDING' | 'SUCCESS' | 'FAILED';
}
