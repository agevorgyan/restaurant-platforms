/**
 * Enterprise Prompt Management Platform - CQRS Read Models
 */

import { PromptType, PromptStatus, EvaluationStatus } from '../../domain/enums/prompt.enums';

export interface PromptCatalogEntry {
  id: string;
  name: string;
  type: PromptType;
  version: string;
  status: PromptStatus;
  author: string;
  description: string;
  variablesCount: number;
  updatedAt: Date;
}

export interface PromptCatalog {
  totalCount: number;
  prompts: PromptCatalogEntry[];
}

export interface PublishedPrompts {
  totalPublished: number;
  publishedPrompts: PromptCatalogEntry[];
}

export interface PromptHistoryItem {
  id: string;
  name: string;
  version: string;
  status: PromptStatus;
  author: string;
  updatedAt: Date;
}

export interface PromptHistory {
  totalVersions: number;
  history: PromptHistoryItem[];
}

export interface EvaluationResults {
  promptId: string;
  version: string;
  status: EvaluationStatus;
  overallScore: number;
  accuracyScore: number;
  safetyScore: number;
  feedback: string;
  evaluatedAt: Date;
}

export interface ApprovalQueueItem {
  promptId: string;
  name: string;
  version: string;
  author: string;
  submittedAt: Date;
}

export interface ApprovalQueue {
  pendingCount: number;
  queue: ApprovalQueueItem[];
}

export interface PromptStatistics {
  totalPrompts: number;
  byStatus: Record<PromptStatus, number>;
  byType: Record<PromptType, number>;
  averageEvaluationScore: number;
}
