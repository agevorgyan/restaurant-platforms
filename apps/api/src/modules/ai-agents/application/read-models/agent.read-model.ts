export interface AgentExecutionHistory {
  tenantId: string;
  executionId: string;
  agentId: string;
  agentType: string;
  goal: string;
  status: 'PLANNING' | 'EXECUTING' | 'WAITING_FOR_TOOL' | 'WAITING_FOR_APPROVAL' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  startedAt: Date;
  completedAt?: Date;
  toolsInvoked: string[];
}

export interface AgentPerformance {
  tenantId: string;
  agentId: string;
  averageExecutionTimeMs: number;
  successRate: number;
  totalExecutions: number;
}

export interface AgentUsageStatistics {
  tenantId: string;
  period: string; // e.g. '2023-10'
  totalExecutions: number;
  totalToolsInvoked: number;
  totalApprovalsRequested: number;
}

export interface PendingApprovals {
  tenantId: string;
  approvals: Array<{
    executionId: string;
    agentId: string;
    toolName: string;
    requestedAt: Date;
    goal: string;
  }>;
}

export interface AgentHealth {
  tenantId: string;
  activeAgents: number;
  idleAgents: number;
  failedExecutionsLastHour: number;
}
