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

export class RuleCatalogReadModel {
  id!: string;
  name!: string;
  version!: string;
  status!: string;
  priority!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class DecisionTablesReadModel {
  id!: string;
  name!: string;
  isEnabled!: boolean;
  inputKeys!: string[];
  outputKeys!: string[];
  createdAt!: Date;
}

export class RuleExecutionsReadModel {
  id!: string;
  ruleId!: string;
  version!: string;
  result!: string;
  firedActionsCount!: number;
  evaluatedAt!: Date;
}

export class SimulationResultsReadModel {
  simulatedAt!: Date;
  matchedRulesCount!: number;
  firedActionsCount!: number;
  executionTimeMs!: number;
}

export class PolicyCatalogReadModel {
  id!: string;
  rulesetId!: string;
  priority!: number;
}

export class RuleStatisticsReadModel {
  totalEvaluations!: number;
  matchesCount!: number;
  failuresCount!: number;
  averageLatencyMs!: number;
}

export class EventCatalogReadModel {
  id!: string;
  type!: string;
  status!: string;
  createdAt!: Date;
}

export class ActiveSubscriptionsReadModel {
  id!: string;
  topic!: string;
  deliveryGuarantee!: string;
  filterExpression?: string;
  isEnabled!: boolean;
}

export class DeadLetterQueueReadModel {
  eventId!: string;
  originalTopic!: string;
  code!: string;
  message!: string;
  deadLetteredAt!: Date;
}

export class ReplayHistoryReadModel {
  eventId!: string;
  replayedAt!: Date;
  triggeredBy!: string;
}

export class EventStatisticsReadModel {
  totalProcessedCount!: number;
  failuresCount!: number;
  dlqCount!: number;
}

export class DeliveryMetricsReadModel {
  topic!: string;
  deliveredCount!: number;
  averageLatencyMs!: number;
}
