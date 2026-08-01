/**
 * Enterprise Feature Flag Platform - Data Transfer Objects (DTOs)
 *
 * Command and Query DTOs for REST presentation layer validation.
 */

import {
  EvaluationResult,
  FeatureStatus,
  FlagType,
  RolloutType,
  TargetType,
} from '../../domain/enums/feature-flag.enums';

export interface TargetRuleDto {
  targetType: TargetType;
  targetValues?: string[];
  isNegated?: boolean;
}

export interface VariantDto {
  variantId: string;
  variantName: string;
  weightPercentage: number;
  payload?: Record<string, unknown>;
}

export interface CreateFeatureFlagDto {
  key: string;
  flagType: FlagType;
  targetRules?: TargetRuleDto[];
  rolloutType?: RolloutType;
  rolloutPercentage?: number;
  variants?: VariantDto[];
  description?: string;
  tags?: string[];
}

export interface UpdateFeatureFlagDto {
  status?: FeatureStatus;
  targetRules?: TargetRuleDto[];
  rolloutType?: RolloutType;
  rolloutPercentage?: number;
  variants?: VariantDto[];
  description?: string;
  tags?: string[];
}

export interface EvaluateFeatureDto {
  featureKey: string;
  context: {
    tenantId: string;
    userId?: string;
    restaurantId?: string;
    departmentId?: string;
    role?: string;
    environment?: string;
    customAttributes?: Record<string, string>;
  };
}

export interface UpdateRolloutDto {
  rolloutType: RolloutType;
  rolloutPercentage: number;
  canaryPercentage?: number;
}

export interface TriggerKillSwitchDto {
  reason: string;
}

export interface FeatureFlagResponseDto {
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
  targetRules: TargetRuleDto[];
  variants: VariantDto[];
  description?: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationResultResponseDto {
  featureKey: string;
  result: EvaluationResult;
  isEnabled: boolean;
  reason: string;
  assignedVariant?: VariantDto;
  evaluationTimeMs: number;
  evaluatedAt: string;
}

export interface RolloutResponseDto {
  featureId: string;
  key: string;
  rolloutType: RolloutType;
  rolloutPercentage: number;
  status: FeatureStatus;
  updatedAt: string;
}

export interface ExperimentResponseDto {
  experimentId: string;
  featureKey: string;
  tenantId: string;
  status: FeatureStatus;
  variants: VariantDto[];
  totalEvaluations: number;
  winningVariantId?: string;
  createdAt: string;
}
