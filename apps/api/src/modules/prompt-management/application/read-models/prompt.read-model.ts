export interface PromptCatalog {
  tenantId: string;
  promptId: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'DEPRECATED' | 'ARCHIVED';
  latestVersionId: string;
  publishedVersionId?: string;
  type: string;
  updatedAt: Date;
}

export interface PromptHistory {
  tenantId: string;
  promptId: string;
  versions: Array<{
    versionId: string;
    status: string;
    createdAt: Date;
    authorId: string;
    template: string;
  }>;
}

export interface PublishedPrompts {
  tenantId: string;
  prompts: Array<{
    promptId: string;
    versionId: string;
    name: string;
    template: string;
    type: string;
    publishedAt: Date;
  }>;
}

export interface PromptApprovalQueue {
  tenantId: string;
  pendingReviews: Array<{
    promptId: string;
    versionId: string;
    name: string;
    submittedBy: string;
    submittedAt: Date;
  }>;
}

export interface PromptUsageReport {
  tenantId: string;
  promptId: string;
  versionId: string;
  period: string; // e.g. '2023-10'
  executionCount: number;
  averageLatencyMs: number;
  averageCostUsd: number;
}

export interface PromptStatistics {
  tenantId: string;
  totalPrompts: number;
  publishedPrompts: number;
  pendingApprovals: number;
  mostUsedPromptId: string;
}
