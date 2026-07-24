export interface ReportDefinition {
  reportCode: string;
  name: string;
  description: string;
  category: string;
  availableFormats: string[];
  requiredFilters: string[];
}

export interface ReportSnapshot {
  reportId: string;
  reportCode: string;
  targetId: string;
  type: string;
  category: string;
  period: string;
  format: string;
  status: string;
  generatedAt: Date;
  downloadUrl?: string;
  fileSizeKb?: number;
}

export interface ReportExecution {
  executionId: string;
  reportId: string;
  startedAt: Date;
  completedAt?: Date;
  status: string;
  errorMessage?: string;
}

export interface ReportHistory {
  targetId: string;
  reportCode: string;
  historicalSnapshots: ReportSnapshot[];
}

export interface ReportSchedule {
  scheduleId: string;
  reportCode: string;
  targetId: string;
  cronExpression: string;
  format: string;
  deliveryChannels: string[];
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
}
