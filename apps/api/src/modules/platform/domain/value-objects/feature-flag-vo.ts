/**
 * Enterprise Feature Flag Platform - Value Objects
 *
 * Immutable Value Objects encapsulating feature flag identity, dot-separated feature keys,
 * target rules, rollout policies, percentage scores, evaluation contexts, experiments, variants,
 * and audience definitions.
 */

import { createHash } from 'crypto';
import { EvaluationResult, FlagType, RolloutType, TargetType } from '../enums/feature-flag.enums';
import { InvalidRolloutPolicyException, InvalidTargetRuleException } from '../exceptions/feature-flag.exceptions';

/**
 * FeatureFlagId Value Object
 */
export class FeatureFlagId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('FeatureFlagId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): FeatureFlagId {
    return new FeatureFlagId(id || `ff-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): FeatureFlagId {
    return new FeatureFlagId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: FeatureFlagId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * FeatureKey Value Object (Dot-separated format e.g. "feature.kitchen.ai_display")
 */
export class FeatureKey {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidTargetRuleException('FeatureKey cannot be empty');
    }
    if (!/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(value.trim())) {
      throw new InvalidTargetRuleException(`Invalid FeatureKey format '${value}'. Must be dot-separated identifiers.`);
    }
    this.value = value.trim().toLowerCase();
  }

  public static create(key: string): FeatureKey {
    return new FeatureKey(key);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * FeatureVersion Value Object
 */
export class FeatureVersion {
  public readonly major: number;
  public readonly minor: number;
  public readonly revision: number;

  private constructor(major: number, minor: number, revision: number) {
    this.major = major;
    this.minor = minor;
    this.revision = revision;
  }

  public static initial(): FeatureVersion {
    return new FeatureVersion(1, 0, 0);
  }

  public static create(major: number, minor: number, revision: number = 0): FeatureVersion {
    return new FeatureVersion(major, minor, revision);
  }

  public incrementMinor(): FeatureVersion {
    return new FeatureVersion(this.major, this.minor + 1, 0);
  }

  public toString(): string {
    return `${this.major}.${this.minor}.${this.revision}`;
  }
}

/**
 * TargetRule Value Object
 */
export class TargetRule {
  public readonly targetType: TargetType;
  public readonly targetValues: string[];
  public readonly isNegated: boolean;

  private constructor(targetType: TargetType, targetValues: string[], isNegated: boolean = false) {
    if (targetType !== TargetType.GLOBAL && targetValues.length === 0) {
      throw new InvalidTargetRuleException(`TargetRule for ${targetType} must contain at least one target value.`);
    }
    this.targetType = targetType;
    this.targetValues = targetValues.map((v) => v.trim().toLowerCase());
    this.isNegated = isNegated;
  }

  public static create(targetType: TargetType, targetValues: string[] = [], isNegated: boolean = false): TargetRule {
    return new TargetRule(targetType, targetValues, isNegated);
  }

  public isMatch(contextValue?: string): boolean {
    if (this.targetType === TargetType.GLOBAL) return true;
    if (!contextValue) return false;

    const match = this.targetValues.includes(contextValue.trim().toLowerCase());
    return this.isNegated ? !match : match;
  }
}

/**
 * RolloutPercentage Value Object (0.0 to 100.0)
 */
export class RolloutPercentage {
  public readonly value: number;

  private constructor(value: number) {
    if (value < 0.0 || value > 100.0) {
      throw new InvalidRolloutPolicyException(`Rollout percentage must be between 0.0 and 100.0, got ${value}`);
    }
    this.value = Math.round(value * 100) / 100;
  }

  public static create(percentage: number): RolloutPercentage {
    return new RolloutPercentage(percentage);
  }

  public static full(): RolloutPercentage {
    return new RolloutPercentage(100.0);
  }

  public static zero(): RolloutPercentage {
    return new RolloutPercentage(0.0);
  }
}

/**
 * RolloutPolicy Value Object
 */
export class RolloutPolicy {
  public readonly rolloutType: RolloutType;
  public readonly percentage: RolloutPercentage;
  public readonly canaryPercentage?: RolloutPercentage;
  public readonly scheduleStart?: Date;
  public readonly scheduleEnd?: Date;

  private constructor(props: {
    rolloutType: RolloutType;
    percentage: RolloutPercentage;
    canaryPercentage?: RolloutPercentage;
    scheduleStart?: Date;
    scheduleEnd?: Date;
  }) {
    this.rolloutType = props.rolloutType;
    this.percentage = props.percentage;
    this.canaryPercentage = props.canaryPercentage;
    this.scheduleStart = props.scheduleStart;
    this.scheduleEnd = props.scheduleEnd;
  }

  public static create(props: {
    rolloutType: RolloutType;
    percentage?: number;
    canaryPercentage?: number;
    scheduleStart?: Date;
    scheduleEnd?: Date;
  }): RolloutPolicy {
    const pct = RolloutPercentage.create(props.percentage ?? 100.0);
    const canaryPct = props.canaryPercentage !== undefined ? RolloutPercentage.create(props.canaryPercentage) : undefined;
    return new RolloutPolicy({
      rolloutType: props.rolloutType,
      percentage: pct,
      canaryPercentage: canaryPct,
      scheduleStart: props.scheduleStart,
      scheduleEnd: props.scheduleEnd,
    });
  }

  public static full(): RolloutPolicy {
    return new RolloutPolicy({
      rolloutType: RolloutType.FULL,
      percentage: RolloutPercentage.full(),
    });
  }
}

/**
 * EvaluationContext Value Object
 */
export class EvaluationContext {
  public readonly tenantId: string;
  public readonly userId?: string;
  public readonly restaurantId?: string;
  public readonly departmentId?: string;
  public readonly role?: string;
  public readonly environment?: string;
  public readonly customAttributes: Record<string, string>;

  private constructor(props: {
    tenantId: string;
    userId?: string;
    restaurantId?: string;
    departmentId?: string;
    role?: string;
    environment?: string;
    customAttributes?: Record<string, string>;
  }) {
    this.tenantId = props.tenantId;
    this.userId = props.userId;
    this.restaurantId = props.restaurantId;
    this.departmentId = props.departmentId;
    this.role = props.role;
    this.environment = props.environment || 'PRODUCTION';
    this.customAttributes = props.customAttributes || {};
  }

  public static create(props: {
    tenantId: string;
    userId?: string;
    restaurantId?: string;
    departmentId?: string;
    role?: string;
    environment?: string;
    customAttributes?: Record<string, string>;
  }): EvaluationContext {
    return new EvaluationContext(props);
  }

  public getContextKey(): string {
    return `${this.tenantId}:${this.userId || 'anon'}:${this.restaurantId || 'global'}`;
  }
}

/**
 * ExperimentId Value Object
 */
export class ExperimentId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(id?: string): ExperimentId {
    return new ExperimentId(id || `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * Variant Value Object (A/B testing variant)
 */
export class Variant {
  public readonly variantId: string;
  public readonly variantName: string;
  public readonly weightPercentage: number;
  public readonly payload?: Record<string, unknown>;

  private constructor(props: {
    variantId: string;
    variantName: string;
    weightPercentage: number;
    payload?: Record<string, unknown>;
  }) {
    this.variantId = props.variantId;
    this.variantName = props.variantName;
    this.weightPercentage = props.weightPercentage;
    this.payload = props.payload;
  }

  public static create(props: {
    variantId: string;
    variantName: string;
    weightPercentage: number;
    payload?: Record<string, unknown>;
  }): Variant {
    return new Variant(props);
  }
}

/**
 * AudienceDefinition Value Object
 */
export class AudienceDefinition {
  public readonly segmentName: string;
  public readonly targetRules: TargetRule[];

  private constructor(segmentName: string, targetRules: TargetRule[]) {
    this.segmentName = segmentName;
    this.targetRules = targetRules;
  }

  public static create(segmentName: string, targetRules: TargetRule[]): AudienceDefinition {
    return new AudienceDefinition(segmentName, targetRules);
  }
}
