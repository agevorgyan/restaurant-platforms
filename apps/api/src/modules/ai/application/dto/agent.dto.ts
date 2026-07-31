/**
 * Enterprise AI Agent Platform - Application DTOs
 */

import { AgentType, AgentStatus } from '../../domain/enums/agent.enums';

export interface CreateAgentDto {
  name: string;
  agentType?: AgentType;
}

export interface ExecuteGoalDto {
  agentId: string;
  goalDescription: string;
}

export interface ApproveStepDto {
  approvedBy: string;
}

export interface AgentResponseDto {
  id: string;
  tenantId: string;
  name: string;
  agentType: AgentType;
  status: AgentStatus;
  currentGoalId?: string;
  goalDescription?: string;
  stepsTotalCount: number;
  currentStepIndex: number;
  pendingApproval?: {
    requestId: string;
    actionName: string;
    riskLevel: string;
  };
  checkpointsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
