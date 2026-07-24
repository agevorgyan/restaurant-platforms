export interface TransformationJob {
  jobId: string;
  mediaId: string;
  tenantId: string;
  profileId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'REALTIME';
  artifacts?: Record<string, string>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface TransformationHistory {
  tenantId: string;
  mediaId: string;
  jobs: TransformationJob[];
}

export interface FailedTransformation {
  jobId: string;
  mediaId: string;
  tenantId: string;
  profileId: string;
  errorCode: string;
  errorMessage: string;
  failedAt: Date;
  stageType?: string;
  retryCount: number;
}

export interface TransformationStatistics {
  tenantId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageLatencyMs: number;
  period: string; // YYYY-MM
}

export interface TransformationHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  activeWorkers: number;
  queuedJobs: number;
  deadLetterJobs: number;
  averageWaitTimeMs: number;
}
