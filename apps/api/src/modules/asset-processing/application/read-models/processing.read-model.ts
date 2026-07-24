export interface ProcessingJob {
  jobId: string;
  documentId: string;
  tenantId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  pipeline: string[];
  currentStage?: string;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessingHistory {
  documentId: string;
  jobs: ProcessingJob[];
  latestResult?: {
    outputArtifacts?: Record<string, string>;
    extractedMetadata?: Record<string, any>;
  };
}

export interface ProcessingStatistics {
  tenantId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTimeMs: number;
  period: string;
}

export interface FailedProcessing {
  jobId: string;
  documentId: string;
  tenantId: string;
  failedStage: string;
  errorCode: string;
  errorMessage: string;
  failedAt: Date;
  canRetry: boolean;
}

export interface PipelineHealth {
  queueLength: number;
  activeWorkers: number;
  errorRate: number; // percentage
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}
