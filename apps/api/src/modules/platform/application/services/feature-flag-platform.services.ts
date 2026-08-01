/**
 * Enterprise Feature Flag Platform - Domain & Application Services
 *
 * Implements core domain and application services:
 * 1. TargetingService (Rule Evaluation & User Segmentation)
 * 2. RolloutService (Deterministic SHA-256 Percentage & Canary Bucketing)
 * 3. ExperimentService (A/B Testing Variant Split Allocations)
 * 4. AudienceService (User Segmentation & Audience Cataloging)
 * 5. VersionService (Semantic Versioning Tracking)
 * 6. EvaluationService (Unified Evaluation Engine with Caching & Kill Switch Overrides)
 * 7. FeatureFlagService (Aggregate Creation, Rollouts & Lifecycle Management)
 * 8. EnterpriseFeatureFlagPlatformService (Platform Façade)
 */

import { Injectable, Inject, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { FeatureFlagAggregate } from '../../domain/models/feature-flag.aggregate';
import {
  EvaluationResult,
  FeatureStatus,
  FlagType,
  RolloutType,
  TargetType,
} from '../../domain/enums/feature-flag.enums';
import {
  EvaluationContext,
  RolloutPolicy,
  TargetRule,
  Variant,
} from '../../domain/value-objects/feature-flag-vo';
import {
  EVALUATION_CACHE_TOKEN,
  FEATURE_FLAG_QUERY_REPOSITORY_TOKEN,
  FEATURE_FLAG_REPOSITORY_TOKEN,
  IEvaluationCachePort,
  IFeatureFlagQueryRepository,
  IFeatureFlagRepository,
} from '../../domain/ports/feature-flag.ports';
import { EVENT_PUBLISHER_TOKEN } from '../../../integration/application/services/connector-platform.services';
import { EventPublisherPort } from '../../../integration/domain/ports/connector.ports';
import {
  CreateFeatureFlagDto,
  EvaluateFeatureDto,
  EvaluationResultResponseDto,
  ExperimentResponseDto,
  FeatureFlagResponseDto,
  RolloutResponseDto,
  TriggerKillSwitchDto,
  UpdateFeatureFlagDto,
  UpdateRolloutDto,
} from '../dto/feature-flag.dto';
import {
  AudienceCatalogReadModel,
  EvaluationHistoryReadModel,
  ExperimentCatalogReadModel,
  FeatureCatalogReadModel,
  FeatureStatisticsReadModel,
  RolloutHistoryReadModel,
} from '../read-models/feature-flag.read-models';
import {
  FeatureFlagNotFoundException,
  UnauthorizedFeatureAccessException,
} from '../../domain/exceptions/feature-flag.exceptions';
import { FeatureEvaluatedEvent } from '../../domain/events/feature-flag.events';

/**
 * Service 1: TargetingService
 * Evaluates target rules against evaluation context attributes (Tenant, User, Restaurant, Role, etc.).
 */
@Injectable()
export class TargetingService {
  public evaluateRules(rules: TargetRule[], context: EvaluationContext): { isMatch: boolean; matchedType?: TargetType } {
    if (rules.length === 0) return { isMatch: true, matchedType: TargetType.GLOBAL };

    for (const rule of rules) {
      let attrValue: string | undefined;

      switch (rule.targetType) {
        case TargetType.GLOBAL:
          return { isMatch: true, matchedType: TargetType.GLOBAL };
        case TargetType.TENANT:
          attrValue = context.tenantId;
          break;
        case TargetType.USER:
          attrValue = context.userId;
          break;
        case TargetType.RESTAURANT:
          attrValue = context.restaurantId;
          break;
        case TargetType.DEPARTMENT:
          attrValue = context.departmentId;
          break;
        case TargetType.ROLE:
          attrValue = context.role;
          break;
        case TargetType.ENVIRONMENT:
          attrValue = context.environment;
          break;
        case TargetType.SEGMENT:
          attrValue = context.customAttributes['segment'];
          break;
      }

      if (rule.isMatch(attrValue)) {
        return { isMatch: true, matchedType: rule.targetType };
      }
    }

    return { isMatch: false };
  }
}

/**
 * Service 2: RolloutService
 * Deterministic SHA-256 hash bucketing for gradual percentage and canary rollouts.
 */
@Injectable()
export class RolloutService {
  public evaluateBucketScore(contextKey: string, featureKey: string): number {
    const hash = createHash('sha256').update(`${contextKey}:${featureKey}`).digest('hex');
    const hexSubstring = hash.substring(0, 8);
    const intValue = parseInt(hexSubstring, 16);
    return (intValue % 10000) / 100.0; // returns 0.00 to 99.99
  }

  public isUserInRollout(policy: RolloutPolicy, bucketScore: number): boolean {
    if (policy.rolloutType === RolloutType.FULL) return true;
    if (policy.rolloutType === RolloutType.PERCENTAGE || policy.rolloutType === RolloutType.GRADUAL) {
      return bucketScore < policy.percentage.value;
    }
    if (policy.rolloutType === RolloutType.CANARY && policy.canaryPercentage) {
      return bucketScore < policy.canaryPercentage.value;
    }
    return bucketScore < policy.percentage.value;
  }
}

/**
 * Service 3: ExperimentService
 * Allocates A/B testing variants deterministically based on weight percentage splits.
 */
@Injectable()
export class ExperimentService {
  public allocateVariant(variants: Variant[], bucketScore: number): Variant | undefined {
    if (variants.length === 0) return undefined;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weightPercentage;
      if (bucketScore < cumulative) {
        return variant;
      }
    }
    return variants[0];
  }
}

/**
 * Service 4: AudienceService
 * Manages user segmentation and audience definition rules.
 */
@Injectable()
export class AudienceService {
  public isInAudience(segmentName: string, context: EvaluationContext): boolean {
    if (!context.customAttributes['segment']) return false;
    return context.customAttributes['segment'].toLowerCase() === segmentName.toLowerCase();
  }
}

/**
 * Service 5: VersionService
 * Feature flag semantic versioning updates.
 */
@Injectable()
export class VersionService {
  public formatVersion(major: number, minor: number, revision: number): string {
    return `${major}.${minor}.${revision}`;
  }
}

/**
 * Service 6: EvaluationService
 * Primary evaluation engine with local cache and immediate kill switch enforcement.
 */
@Injectable()
export class EvaluationService {
  constructor(
    private readonly targetingService: TargetingService,
    private readonly rolloutService: RolloutService,
    private readonly experimentService: ExperimentService,
    @Inject(EVALUATION_CACHE_TOKEN)
    private readonly cache: IEvaluationCachePort
  ) {}

  public async evaluate(
    flag: FeatureFlagAggregate,
    context: EvaluationContext
  ): Promise<{ result: EvaluationResult; reason: string; variant?: Variant }> {
    const cacheKey = `${flag.getTenantId()}:${flag.getKey().getValue()}:${context.getContextKey()}`;

    // Check Local Cache
    const cached = await this.cache.get(cacheKey);
    if (cached !== null) {
      return { result: cached, reason: 'LocalCacheHit' };
    }

    // 1. Emergency Kill Switch Check (Immediate Propagation)
    if (flag.getIsKillSwitchActive()) {
      const result = EvaluationResult.DISABLED;
      await this.cache.set(cacheKey, result, 5);
      return { result, reason: `KillSwitchActive: ${flag.getKillSwitchReason() || 'Emergency Override'}` };
    }

    // 2. Lifecycle Status Check
    if (flag.getStatus() !== FeatureStatus.ACTIVE) {
      const result = EvaluationResult.DISABLED;
      await this.cache.set(cacheKey, result, 60);
      return { result, reason: `FlagStatusIsNotActive: ${flag.getStatus()}` };
    }

    // 3. Target Rules Evaluation
    const targeting = this.targetingService.evaluateRules(flag.getTargetRules(), context);
    if (!targeting.isMatch) {
      const result = EvaluationResult.DISABLED;
      await this.cache.set(cacheKey, result, 60);
      return { result, reason: 'TargetingRuleMismatch' };
    }

    // 4. Rollout Policy Evaluation (Deterministic SHA-256 Bucket)
    const bucketScore = this.rolloutService.evaluateBucketScore(context.getContextKey(), flag.getKey().getValue());
    const inRollout = this.rolloutService.isUserInRollout(flag.getRolloutPolicy(), bucketScore);

    if (!inRollout) {
      const result = EvaluationResult.DISABLED;
      await this.cache.set(cacheKey, result, 30);
      return { result, reason: `RolloutBucketExceeded (${bucketScore.toFixed(1)}% >= ${flag.getRolloutPolicy().percentage.value}%)` };
    }

    // 5. Variant Allocation (if experiment flag)
    let assignedVariant: Variant | undefined;
    if (flag.getFlagType() === FlagType.EXPERIMENT_FLAG && flag.getVariants().length > 0) {
      assignedVariant = this.experimentService.allocateVariant(flag.getVariants(), bucketScore);
    }

    const finalResult = EvaluationResult.ENABLED;
    await this.cache.set(cacheKey, finalResult, 300);

    return {
      result: finalResult,
      reason: `TargetingMatched (${targeting.matchedType || 'GLOBAL'}) & RolloutPassed`,
      variant: assignedVariant,
    };
  }
}

/**
 * Service 7: FeatureFlagService
 * Core aggregate creation, status state machine, rollout updates, and kill switch triggers.
 */
@Injectable()
export class FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY_TOKEN)
    private readonly repo: IFeatureFlagRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    @Inject(EVALUATION_CACHE_TOKEN)
    private readonly cache: IEvaluationCachePort
  ) {}

  public async createFeature(
    tenantId: string,
    dto: CreateFeatureFlagDto,
    createdBy: string = 'system'
  ): Promise<FeatureFlagAggregate> {
    const targetRules: TargetRule[] = (dto.targetRules || []).map((r) =>
      TargetRule.create(r.targetType, r.targetValues || [], r.isNegated ?? false)
    );

    const rolloutPolicy = dto.rolloutType
      ? RolloutPolicy.create({ rolloutType: dto.rolloutType, percentage: dto.rolloutPercentage })
      : RolloutPolicy.full();

    const variants: Variant[] = (dto.variants || []).map((v) =>
      Variant.create({
        variantId: v.variantId,
        variantName: v.variantName,
        weightPercentage: v.weightPercentage,
        payload: v.payload,
      })
    );

    const flag = FeatureFlagAggregate.create({
      tenantId,
      key: dto.key,
      flagType: dto.flagType,
      targetRules,
      rolloutPolicy,
      variants,
      description: dto.description,
      tags: dto.tags,
      createdBy,
    });

    await this.repo.save(flag);
    await this.eventPublisher.publishAll(flag.getUncommittedEvents());
    flag.clearUncommittedEvents();

    return flag;
  }

  public async triggerKillSwitch(
    flag: FeatureFlagAggregate,
    activatedBy: string,
    reason: string
  ): Promise<FeatureFlagAggregate> {
    flag.triggerKillSwitch(activatedBy, reason);
    await this.repo.save(flag);
    await this.cache.invalidate(flag.getKey().getValue());

    await this.eventPublisher.publishAll(flag.getUncommittedEvents());
    flag.clearUncommittedEvents();

    return flag;
  }

  public async updateRollout(
    flag: FeatureFlagAggregate,
    dto: UpdateRolloutDto,
    updatedBy: string = 'system'
  ): Promise<FeatureFlagAggregate> {
    const policy = RolloutPolicy.create({
      rolloutType: dto.rolloutType,
      percentage: dto.rolloutPercentage,
      canaryPercentage: dto.canaryPercentage,
    });

    flag.updateRolloutPolicy(policy, updatedBy);
    await this.repo.save(flag);
    await this.cache.invalidate(flag.getKey().getValue());

    await this.eventPublisher.publishAll(flag.getUncommittedEvents());
    flag.clearUncommittedEvents();

    return flag;
  }
}

/**
 * Service 8: EnterpriseFeatureFlagPlatformService
 * Platform façade service for NestJS controllers and external callers.
 */
@Injectable()
export class EnterpriseFeatureFlagPlatformService {
  private readonly logger = new Logger(EnterpriseFeatureFlagPlatformService.name);

  constructor(
    @Inject(FEATURE_FLAG_REPOSITORY_TOKEN)
    private readonly repo: IFeatureFlagRepository,
    @Inject(FEATURE_FLAG_QUERY_REPOSITORY_TOKEN)
    private readonly queryRepo: IFeatureFlagQueryRepository,
    @Inject(EVENT_PUBLISHER_TOKEN)
    private readonly eventPublisher: EventPublisherPort,
    private readonly evaluationService: EvaluationService,
    private readonly featureFlagService: FeatureFlagService
  ) {}

  public async getFeatures(
    tenantId: string,
    flagType?: FlagType,
    status?: FeatureStatus
  ): Promise<FeatureCatalogReadModel> {
    return this.queryRepo.getCatalog(tenantId, flagType, status);
  }

  public async getFeatureById(tenantId: string, id: string): Promise<FeatureFlagResponseDto> {
    const flag = await this.repo.findById(id, tenantId);
    if (!flag) throw new FeatureFlagNotFoundException(id);

    if (flag.getTenantId() !== tenantId && flag.getTenantId() !== 'system-template') {
      throw new UnauthorizedFeatureAccessException(tenantId, id);
    }

    return this.toResponseDto(flag);
  }

  public async createFeature(
    tenantId: string,
    dto: CreateFeatureFlagDto,
    createdBy: string = 'system'
  ): Promise<FeatureFlagResponseDto> {
    const flag = await this.featureFlagService.createFeature(tenantId, dto, createdBy);
    return this.toResponseDto(flag);
  }

  public async updateFeature(
    tenantId: string,
    id: string,
    dto: UpdateFeatureFlagDto,
    updatedBy: string = 'system'
  ): Promise<FeatureFlagResponseDto> {
    const flag = await this.repo.findById(id, tenantId);
    if (!flag) throw new FeatureFlagNotFoundException(id);

    if (flag.getTenantId() !== tenantId) {
      throw new UnauthorizedFeatureAccessException(tenantId, id);
    }

    if (dto.status) flag.updateStatus(dto.status, updatedBy);
    if (dto.targetRules) {
      const rules = dto.targetRules.map((r) =>
        TargetRule.create(r.targetType, r.targetValues || [], r.isNegated ?? false)
      );
      flag.updateTargetRules(rules, updatedBy);
    }
    if (dto.rolloutType && dto.rolloutPercentage !== undefined) {
      const policy = RolloutPolicy.create({
        rolloutType: dto.rolloutType,
        percentage: dto.rolloutPercentage,
      });
      flag.updateRolloutPolicy(policy, updatedBy);
    }

    await this.repo.save(flag);
    await this.eventPublisher.publishAll(flag.getUncommittedEvents());
    flag.clearUncommittedEvents();

    return this.toResponseDto(flag);
  }

  public async evaluateFeature(dto: EvaluateFeatureDto): Promise<EvaluationResultResponseDto> {
    const startMs = Date.now();
    const flag = await this.repo.findByKey(dto.featureKey, dto.context.tenantId);
    if (!flag) throw new FeatureFlagNotFoundException(dto.featureKey);

    const context = EvaluationContext.create({
      tenantId: dto.context.tenantId,
      userId: dto.context.userId,
      restaurantId: dto.context.restaurantId,
      departmentId: dto.context.departmentId,
      role: dto.context.role,
      environment: dto.context.environment,
      customAttributes: dto.context.customAttributes,
    });

    const evalResult = await this.evaluationService.evaluate(flag, context);
    const evaluationTimeMs = Date.now() - startMs;

    await this.queryRepo.saveEvaluationLog(
      dto.context.tenantId,
      dto.featureKey,
      evalResult.result,
      evalResult.reason,
      evaluationTimeMs
    );

    this.eventPublisher.publish(
      new FeatureEvaluatedEvent(
        flag.getId().getValue(),
        dto.context.tenantId,
        dto.featureKey,
        evalResult.result,
        evalResult.reason,
        evaluationTimeMs
      )
    );

    return {
      featureKey: dto.featureKey,
      result: evalResult.result,
      isEnabled: evalResult.result === EvaluationResult.ENABLED,
      reason: evalResult.reason,
      assignedVariant: evalResult.variant
        ? {
            variantId: evalResult.variant.variantId,
            variantName: evalResult.variant.variantName,
            weightPercentage: evalResult.variant.weightPercentage,
            payload: evalResult.variant.payload,
          }
        : undefined,
      evaluationTimeMs,
      evaluatedAt: new Date().toISOString(),
    };
  }

  public async updateRollout(
    tenantId: string,
    id: string,
    dto: UpdateRolloutDto,
    updatedBy: string = 'system'
  ): Promise<RolloutResponseDto> {
    const flag = await this.repo.findById(id, tenantId);
    if (!flag) throw new FeatureFlagNotFoundException(id);

    if (flag.getTenantId() !== tenantId) {
      throw new UnauthorizedFeatureAccessException(tenantId, id);
    }

    const updated = await this.featureFlagService.updateRollout(flag, dto, updatedBy);

    return {
      featureId: updated.getId().getValue(),
      key: updated.getKey().getValue(),
      rolloutType: updated.getRolloutPolicy().rolloutType,
      rolloutPercentage: updated.getRolloutPolicy().percentage.value,
      status: updated.getStatus(),
      updatedAt: updated.getUpdatedAt().toISOString(),
    };
  }

  public async triggerKillSwitch(
    tenantId: string,
    id: string,
    dto: TriggerKillSwitchDto,
    activatedBy: string = 'system'
  ): Promise<FeatureFlagResponseDto> {
    const flag = await this.repo.findById(id, tenantId);
    if (!flag) throw new FeatureFlagNotFoundException(id);

    if (flag.getTenantId() !== tenantId) {
      throw new UnauthorizedFeatureAccessException(tenantId, id);
    }

    const updated = await this.featureFlagService.triggerKillSwitch(flag, activatedBy, dto.reason);
    return this.toResponseDto(updated);
  }

  public async getExperimentCatalog(tenantId?: string): Promise<ExperimentCatalogReadModel> {
    return this.queryRepo.getExperimentCatalog(tenantId);
  }

  public async getRolloutHistory(tenantId?: string, key?: string): Promise<RolloutHistoryReadModel> {
    return this.queryRepo.getRolloutHistory(tenantId, key);
  }

  public async getEvaluationHistory(tenantId?: string, key?: string): Promise<EvaluationHistoryReadModel> {
    return this.queryRepo.getEvaluationHistory(tenantId, key);
  }

  public async getAudienceCatalog(tenantId?: string): Promise<AudienceCatalogReadModel> {
    return this.queryRepo.getAudienceCatalog(tenantId);
  }

  public async getStatistics(tenantId?: string): Promise<FeatureStatisticsReadModel> {
    return this.queryRepo.getStatistics(tenantId);
  }

  private toResponseDto(flag: FeatureFlagAggregate): FeatureFlagResponseDto {
    return {
      id: flag.getId().getValue(),
      tenantId: flag.getTenantId(),
      key: flag.getKey().getValue(),
      version: flag.getVersion().toString(),
      flagType: flag.getFlagType(),
      status: flag.getStatus(),
      isKillSwitchActive: flag.getIsKillSwitchActive(),
      killSwitchReason: flag.getKillSwitchReason(),
      rolloutType: flag.getRolloutPolicy().rolloutType,
      rolloutPercentage: flag.getRolloutPolicy().percentage.value,
      targetRules: flag.getTargetRules().map((r) => ({
        targetType: r.targetType,
        targetValues: r.targetValues,
        isNegated: r.isNegated,
      })),
      variants: flag.getVariants().map((v) => ({
        variantId: v.variantId,
        variantName: v.variantName,
        weightPercentage: v.weightPercentage,
        payload: v.payload,
      })),
      description: flag.getDescription(),
      tags: flag.getTags(),
      createdBy: flag.getCreatedBy(),
      updatedBy: flag.getUpdatedBy(),
      createdAt: flag.getCreatedAt().toISOString(),
      updatedAt: flag.getUpdatedAt().toISOString(),
    };
  }
}
