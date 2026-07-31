/**
 * Enterprise Prompt Management Platform - Hexagonal Domain Ports
 */

import { PromptAggregate } from '../models/prompt.aggregate';
import { PromptId, PromptTestCase, PromptEvaluation } from '../value-objects/prompt-vo';
import { PromptType, PromptStatus } from '../enums/prompt.enums';

export interface PromptRepositoryPort {
  save(prompt: PromptAggregate): Promise<void>;
  findById(id: PromptId): Promise<PromptAggregate | null>;
  findByNameAndVersion(name: string, version: string, tenantId?: string): Promise<PromptAggregate | null>;
  findAll(filters?: {
    tenantId?: string;
    type?: PromptType;
    status?: PromptStatus;
    limit?: number;
    offset?: number;
  }): Promise<PromptAggregate[]>;
}

export interface PromptEvaluationPort {
  runTestCase(prompt: PromptAggregate, testCase: PromptTestCase): Promise<PromptEvaluation>;
}
