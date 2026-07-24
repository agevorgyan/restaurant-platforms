export interface AiSessionSummary {
  tenantId: string;
  sessionId: string;
  userId: string;
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'EXPIRED';
  startedAt: Date;
  lastActivityAt: Date;
  messageCount: number;
}

export interface ConversationHistory {
  tenantId: string;
  sessionId: string;
  messages: Array<{
    id: string;
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: Date;
  }>;
}

export interface ExecutionHistory {
  tenantId: string;
  executionId: string;
  sessionId: string;
  model: string;
  status: string;
  latencyMs: number;
  timestamp: Date;
}

export interface UsageStatistics {
  tenantId: string;
  period: string; // e.g. '2023-10'
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalExecutions: number;
  errorRate: number;
}

export interface CostStatistics {
  tenantId: string;
  period: string;
  totalCostUsd: number;
  costByModel: Record<string, number>;
}

export interface AiPlatformHealth {
  tenantId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  activeSessions: number;
  averageLatencyMs: number;
  lastChecked: Date;
}
