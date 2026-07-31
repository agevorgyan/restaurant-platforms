/**
 * Enterprise AI Agent Platform - CQRS Read Models
 */

import { AgentType, AgentStatus } from '../../domain/enums/agent.enums';

export interface AgentCatalogEntry {
  id: string;
  name: string;
  agentType: AgentType;
  status: AgentStatus;
  checkpointsCount: number;
  updatedAt: Date;
}

export interface AgentCatalog {
  totalCount: number;
  agents: AgentCatalogEntry[];
}

export interface ExecutionPlans {
  totalPlans: number;
  plans: {
    agentId: string;
    goalDescription: string;
    stepsCount: number;
    estimatedDurationMs: number;
  }[];
}

export interface ExecutionHistoryItem {
  id: string;
  tenantId: string;
  agentName: string;
  goalDescription: string;
  status: AgentStatus;
  stepsCompleted: number;
  timestamp: Date;
}

export interface ExecutionHistory {
  totalExecutions: number;
  history: ExecutionHistoryItem[];
}

export interface AgentApprovalQueueItem {
  agentId: string;
  requestId: string;
  actionName: string;
  riskLevel: string;
  requestedAt: Date;
}

export interface AgentApprovalQueue {
  pendingApprovalsCount: number;
  queue: AgentApprovalQueueItem[];
}

export interface ReasoningHistory {
  totalTraces: number;
  traces: {
    agentId: string;
    thoughtProcess: string;
    rationale: string;
    confidenceScore: number;
    timestamp: Date;
  }[];
}

export interface AgentStatistics {
  totalAgents: number;
  byStatus: Record<AgentStatus, number>;
  byType: Record<AgentType, number>;
  stepSuccessRatePercentage: number;
}
