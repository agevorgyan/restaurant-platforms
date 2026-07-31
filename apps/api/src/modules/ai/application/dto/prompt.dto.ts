/**
 * Enterprise Prompt Management Platform - Application DTOs
 */

import { PromptType, PromptStatus, EvaluationStatus } from '../../domain/enums/prompt.enums';

export interface CreatePromptDto {
  name: string;
  type?: PromptType;
  version?: string;
  templateText: string;
  author: string;
  description: string;
  category?: string;
  tags?: string[];
}

export interface UpdatePromptDto {
  templateText?: string;
  description?: string;
}

export interface EvaluatePromptDto {
  testVariables: Record<string, unknown>;
  expectedOutputContains?: string;
}

export interface ApprovePromptDto {
  approvedBy: string;
}

export interface PromptQueryDto {
  tenantId?: string;
  type?: PromptType;
  status?: PromptStatus;
  limit?: number;
  offset?: number;
}

export interface PromptResponseDto {
  id: string;
  tenantId: string;
  name: string;
  type: PromptType;
  version: string;
  status: PromptStatus;
  templateText: string;
  variables: string[];
  author: string;
  description: string;
  evaluationStatus?: EvaluationStatus;
  overallScore?: number;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
