/**
 * Enterprise Feature Flag Platform - Read Models (CQRS Queries)
 *
 * Strongly-typed read projections for feature catalog, experiment catalog, rollout history,
 * evaluation telemetry, audience catalog, and feature flag statistics.
 */

import { EvaluationResult, FeatureStatus, FlagType, RolloutType, TargetType } from '../../domain/enums/feature-flag.enums';

export interface TargetRuleReadModel {
  targetType: TargetType;
  targetValues: string[];
  isNegated: boolean;
}

export interface FeatureSummaryReadModel {
  id: string;
  tenantId: string;
  key: string;
  version: string;
  flagType: FlagType;
  status: FeatureStatus;
  isKillSwitchActive: boolean;
  killSwitchReason?: string;
  rolloutType: RolloutType;
  rolloutPercentage: number;
  targetRules: TargetRuleReadModel[];
  variantsCount: number;
  description?: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureCatalogReadModel {
  tenantId?: string;
  totalFeatures: number;
  features: FeatureSummaryReadModel[];
}

export interface ExperimentSummaryReadModel {
  experimentId: string;
  featureKey: string;
  tenantId: string;
  status: FeatureStatus;
  variants: { variantId: string; variantName: string; weightPercentage: number }[];
  totalEvaluations: number;
  winningVariantId?: string;
  createdAt: string;
}

export interface ExperimentCatalogReadModel {
  tenantId?: string;
  totalExperiments: number;
  experiments: ExperimentSummaryReadModel[];
}

export interface RolloutLogEntry {
  logId: string;
  featureId: string;
  key: string;
  tenantId: string;
  rolloutType: RolloutType;
  percentage: number;
  updatedBy: string;
  timestamp: string;
}

export interface RolloutHistoryReadModel {
  tenantId?: string;
  key?: string;
  totalRolloutEvents: number;
  history: RolloutLogEntry[];
}

export interface EvaluationLogEntry {
  logId: string;
  featureKey: string;
  tenantId: string;
  result: EvaluationResult;
  reason: string;
  evaluationTimeMs: number;
  timestamp: string;
}

export interface EvaluationHistoryReadModel {
  tenantId?: string;
  key?: string;
  totalEvaluations: number;
  averageEvaluationTimeMs: number;
  enabledCount: number;
  disabledCount: number;
  conditionalCount: number;
  history: EvaluationLogEntry[];
}

export interface AudienceSegmentReadModel {
  segmentName: string;
  tenantId: string;
  targetRulesCount: number;
  createdAt: string;
}

export interface AudienceCatalogReadModel {
  tenantId?: string;
  totalSegments: number;
  segments: AudienceSegmentReadModel[];
}

export interface FeatureStatisticsReadModel {
  tenantId?: string;
  totalFlags: number;
  activeFlagsCount: number;
  killSwitchesActiveCount: number;
  byStatus: Record<FeatureStatus, number>;
  byFlagType: Record<FlagType, number>;
  totalEvaluations24h: number;
  cacheHitRatioPercentage: number;
}
