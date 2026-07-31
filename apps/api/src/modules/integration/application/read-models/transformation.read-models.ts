/**
 * Enterprise Data Transformation Platform - CQRS Read Models
 */

import { TransformationStatus, TransformationType } from '../../domain/enums/transformation.enums';

export interface TransformationCatalogEntry {
  id: string;
  tenantId: string;
  name: string;
  type: TransformationType;
  version: string;
  status: TransformationStatus;
  description: string;
  rulesCount: number;
  createdAt: Date;
}

export interface TransformationCatalog {
  totalCount: number;
  transformations: TransformationCatalogEntry[];
}

export interface SchemaRegistryItem {
  name: string;
  version: string;
  jsonSchema: Record<string, unknown>;
  registeredAt?: Date;
}

export interface SchemaRegistry {
  totalCount: number;
  schemas: SchemaRegistryItem[];
}

export interface MappingStatistics {
  totalTransformations: number;
  totalPublished: number;
  totalDraft: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTimeMs: number;
  byType: Record<TransformationType, number>;
}

export interface ValidationResults {
  transformationId: string;
  isValid: boolean;
  ruleCount: number;
  errors: string[];
}

export interface TransformationHistoryItem {
  transformationId: string;
  version: string;
  tenantId: string;
  status: string;
  fieldsMapped: number;
  executionTimeMs: number;
  executedAt: Date;
}

export interface TransformationHistory {
  totalCount: number;
  history: TransformationHistoryItem[];
}

export interface VersionCatalogItem {
  transformationId: string;
  version: string;
  status: TransformationStatus;
  publishedAt?: Date;
}

export interface VersionCatalog {
  versions: VersionCatalogItem[];
}
