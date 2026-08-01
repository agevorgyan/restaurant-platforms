/**
 * Enterprise Feature Flag Platform - Domain Ports (Interfaces)
 *
 * Hexagonal architecture ports for feature flag persistence, CQRS read queries,
 * local evaluation caching, and experiment telemetry.
 */

import { FeatureFlagAggregate } from '../models/feature-flag.aggregate';
import { EvaluationResult, FeatureStatus, FlagType } from '../enums/feature-flag.enums';
import { EvaluationContext } from '../value-objects/feature-flag-vo';
import {
  AudienceCatalogReadModel,
  EvaluationHistoryReadModel,
  ExperimentCatalogReadModel,
  FeatureCatalogReadModel,
  FeatureStatisticsReadModel,
  RolloutHistoryReadModel,
} from '../../application/read-models/feature-flag.read-models';

export const FEATURE_FLAG_REPOSITORY_TOKEN = Symbol('IFeatureFlagRepository');
export const FEATURE_FLAG_QUERY_REPOSITORY_TOKEN = Symbol('IFeatureFlagQueryRepository');
export const EVALUATION_CACHE_TOKEN = Symbol('IEvaluationCachePort');

export interface IFeatureFlagRepository {
  save(flag: FeatureFlagAggregate): Promise<void>;
  findById(id: string, tenantId?: string): Promise<FeatureFlagAggregate | null>;
  findByKey(key: string, tenantId?: string): Promise<FeatureFlagAggregate | null>;
  findByTenant(
    tenantId: string,
    flagType?: FlagType,
    status?: FeatureStatus
  ): Promise<FeatureFlagAggregate[]>;
  delete(id: string, tenantId: string): Promise<boolean>;
}

export interface IFeatureFlagQueryRepository {
  getCatalog(
    tenantId?: string,
    flagType?: FlagType,
    status?: FeatureStatus
  ): Promise<FeatureCatalogReadModel>;

  getExperimentCatalog(tenantId?: string): Promise<ExperimentCatalogReadModel>;

  getRolloutHistory(tenantId?: string, key?: string): Promise<RolloutHistoryReadModel>;

  getEvaluationHistory(tenantId?: string, key?: string): Promise<EvaluationHistoryReadModel>;

  getAudienceCatalog(tenantId?: string): Promise<AudienceCatalogReadModel>;

  getStatistics(tenantId?: string): Promise<FeatureStatisticsReadModel>;

  saveEvaluationLog(
    tenantId: string,
    key: string,
    result: EvaluationResult,
    reason: string,
    evaluationTimeMs: number
  ): Promise<void>;
}

export interface IEvaluationCachePort {
  get(cacheKey: string): Promise<EvaluationResult | null>;
  set(cacheKey: string, result: EvaluationResult, ttlSec?: number): Promise<void>;
  invalidate(flagKey: string): Promise<void>;
  clear(): Promise<void>;
}
