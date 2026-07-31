/**
 * Enterprise AI Agent Platform - Hexagonal Domain Ports
 */

import { AgentAggregate } from '../models/agent.aggregate';
import { AgentId } from '../value-objects/agent-vo';
import { AgentType, AgentStatus } from '../enums/agent.enums';

export interface AgentRepositoryPort {
  save(agent: AgentAggregate): Promise<void>;
  findById(id: AgentId): Promise<AgentAggregate | null>;
  findAll(tenantId?: string, filters?: { type?: AgentType; status?: AgentStatus }): Promise<AgentAggregate[]>;
}

export interface ToolExecutionPort {
  executeToolAction(actionName: string, parameters: Record<string, unknown>): Promise<unknown>;
}
