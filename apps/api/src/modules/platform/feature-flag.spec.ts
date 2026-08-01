/**
 * Enterprise Feature Flag Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, FeatureFlagAggregate Root & Lifecycle, Target Rules Evaluation,
 * Deterministic SHA-256 Percentage & Canary Rollout Bucketing, A/B Testing Variant Splits,
 * Emergency Kill Switch Overrides, Evaluation Caching, RLS Tenant Security, and Read Models.
 */

import {
  AudienceDefinition,
  EvaluationContext,
  FeatureFlagId,
  FeatureKey,
  FeatureVersion,
  RolloutPercentage,
  RolloutPolicy,
  TargetRule,
  Variant,
} from './domain/value-objects/feature-flag-vo';
import {
  EvaluationResult,
  FeatureStatus,
  FlagType,
  RolloutType,
  TargetType,
} from './domain/enums/feature-flag.enums';
import { FeatureFlagAggregate } from './domain/models/feature-flag.aggregate';
import { InMemoryFeatureFlagRepository } from './infrastructure/repositories/in-memory-feature-flag.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  AudienceService,
  EnterpriseFeatureFlagPlatformService,
  EvaluationService,
  ExperimentService,
  FeatureFlagService,
  RolloutService,
  TargetingService,
} from './application/services/feature-flag-platform.services';
import {
  InvalidRolloutPolicyException,
  InvalidTargetRuleException,
  UnauthorizedFeatureAccessException,
} from './domain/exceptions/feature-flag.exceptions';

describe('Enterprise Feature Flag Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format dot-separated FeatureKey and format versions', () => {
      const key = FeatureKey.create('feature.kitchen.ai_display');
      expect(key.getValue()).toBe('feature.kitchen.ai_display');

      const version = FeatureVersion.initial();
      expect(version.toString()).toBe('1.0.0');
    });

    it('should throw exception for invalid FeatureKey format', () => {
      expect(() => FeatureKey.create('invalid flag key')).toThrow(InvalidTargetRuleException);
    });

    it('should validate RolloutPercentage range (0.0 to 100.0)', () => {
      const pct = RolloutPercentage.create(50.0);
      expect(pct.value).toBe(50.0);

      expect(() => RolloutPercentage.create(120.0)).toThrow(InvalidRolloutPolicyException);
      expect(() => RolloutPercentage.create(-5.0)).toThrow(InvalidRolloutPolicyException);
    });

    it('should evaluate TargetRule matches correctly', () => {
      const tenantRule = TargetRule.create(TargetType.TENANT, ['tenant-alpha', 'tenant-beta']);
      expect(tenantRule.isMatch('tenant-alpha')).toBe(true);
      expect(tenantRule.isMatch('tenant-gamma')).toBe(false);

      const negatedRule = TargetRule.create(TargetType.ROLE, ['admin'], true);
      expect(negatedRule.isMatch('manager')).toBe(true);
      expect(negatedRule.isMatch('admin')).toBe(false);
    });
  });

  describe('FeatureFlagAggregate Root & Lifecycle', () => {
    it('should create a new FeatureFlag aggregate in DRAFT status and emit FeatureCreated event', () => {
      const flag = FeatureFlagAggregate.create({
        key: 'feature.billing.stripe_terminal',
        flagType: FlagType.RELEASE_FLAG,
        tenantId: 'tenant-bill-1',
      });

      expect(flag.getStatus()).toBe(FeatureStatus.DRAFT);
      expect(flag.getVersion().toString()).toBe('1.0.0');
      expect(flag.getUncommittedEvents().length).toBe(1);
      expect(flag.getUncommittedEvents()[0].eventName).toBe('FeatureCreated');
    });

    it('should activate feature flag and emit FeatureActivated event', () => {
      const flag = FeatureFlagAggregate.create({
        key: 'feature.pos.quick_keys',
        flagType: FlagType.RELEASE_FLAG,
        tenantId: 'tenant-pos-1',
      });

      flag.activate('admin-user');
      expect(flag.getStatus()).toBe(FeatureStatus.ACTIVE);
      expect(flag.getUncommittedEvents().some((e) => e.eventName === 'FeatureActivated')).toBe(true);
    });

    it('should trigger emergency kill switch and emit KillSwitchActivated event', () => {
      const flag = FeatureFlagAggregate.create({
        key: 'emergency.gateway.kill_switch',
        flagType: FlagType.KILL_SWITCH,
        tenantId: 'tenant-emerg-1',
      });

      flag.triggerKillSwitch('sec-ops', 'Upstream Provider Outage');
      expect(flag.getIsKillSwitchActive()).toBe(true);
      expect(flag.getKillSwitchReason()).toBe('Upstream Provider Outage');
      expect(flag.getUncommittedEvents().some((e) => e.eventName === 'KillSwitchActivated')).toBe(true);
    });
  });

  describe('Deterministic Evaluation & Rollout Engine', () => {
    let rolloutService: RolloutService;

    beforeEach(() => {
      rolloutService = new RolloutService();
    });

    it('should compute 100% deterministic SHA-256 bucket scores for a user context', () => {
      const score1 = rolloutService.evaluateBucketScore('tenant-1:user-42', 'feature.ai.recommendations');
      const score2 = rolloutService.evaluateBucketScore('tenant-1:user-42', 'feature.ai.recommendations');

      expect(score1).toBeGreaterThanOrEqual(0.0);
      expect(score1).toBeLessThan(100.0);
      expect(score1).toBe(score2); // 100% deterministic
    });

    it('should accurately evaluate percentage rollout boundaries', () => {
      const policy = RolloutPolicy.create({ rolloutType: RolloutType.PERCENTAGE, percentage: 50.0 });

      expect(rolloutService.isUserInRollout(policy, 25.0)).toBe(true);
      expect(rolloutService.isUserInRollout(policy, 75.0)).toBe(false);
    });
  });

  describe('Platform Domain & Application Services', () => {
    let repo: InMemoryFeatureFlagRepository;
    let eventPublisher: NestEventPublisherAdapter;
    let targetingService: TargetingService;
    let rolloutService: RolloutService;
    let experimentService: ExperimentService;
    let audienceService: AudienceService;
    let evaluationService: EvaluationService;
    let flagService: FeatureFlagService;
    let platformService: EnterpriseFeatureFlagPlatformService;

    beforeEach(() => {
      repo = new InMemoryFeatureFlagRepository();
      eventPublisher = new NestEventPublisherAdapter();

      targetingService = new TargetingService();
      rolloutService = new RolloutService();
      experimentService = new ExperimentService();
      audienceService = new AudienceService();

      evaluationService = new EvaluationService(
        targetingService,
        rolloutService,
        experimentService,
        repo
      );

      flagService = new FeatureFlagService(
        repo,
        eventPublisher,
        repo
      );

      platformService = new EnterpriseFeatureFlagPlatformService(
        repo,
        repo,
        eventPublisher,
        evaluationService,
        flagService
      );
    });

    it('should query seeded default feature flags across all 8 flag types', async () => {
      const catalog = await platformService.getFeatures('tenant-default');
      expect(catalog.totalFeatures).toBe(8);

      const types = catalog.features.map((f) => f.flagType);
      expect(types).toContain(FlagType.RELEASE_FLAG);
      expect(types).toContain(FlagType.EXPERIMENT_FLAG);
      expect(types).toContain(FlagType.OPERATIONAL_FLAG);
      expect(types).toContain(FlagType.PERMISSION_FLAG);
      expect(types).toContain(FlagType.KILL_SWITCH);
      expect(types).toContain(FlagType.MIGRATION_FLAG);
      expect(types).toContain(FlagType.PREMIUM_FEATURE);
      expect(types).toContain(FlagType.DEVELOPER_FLAG);
    });

    it('should register a new feature flag and evaluate deterministically', async () => {
      const created = await platformService.createFeature('tenant-kitch-1', {
        key: 'feature.kitchen.voice_commands',
        flagType: FlagType.RELEASE_FLAG,
        rolloutType: RolloutType.FULL,
        description: 'Voice Commands in Kitchen Station',
      });

      await platformService.updateFeature('tenant-kitch-1', created.id, { status: FeatureStatus.ACTIVE });

      const evaluation = await platformService.evaluateFeature({
        featureKey: 'feature.kitchen.voice_commands',
        context: {
          tenantId: 'tenant-kitch-1',
          userId: 'user-chef-99',
          restaurantId: 'rest-main-1',
        },
      });

      expect(evaluation.result).toBe(EvaluationResult.ENABLED);
      expect(evaluation.isEnabled).toBe(true);
      expect(evaluation.evaluationTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should immediately disable evaluation when emergency kill switch is triggered', async () => {
      const catalog = await platformService.getFeatures('tenant-default');
      const targetFlag = catalog.features[0];

      await platformService.triggerKillSwitch('tenant-default', targetFlag.id, {
        reason: 'Database lock contention discovered',
      });

      const evaluation = await platformService.evaluateFeature({
        featureKey: targetFlag.key,
        context: { tenantId: 'tenant-default', userId: 'user-100' },
      });

      expect(evaluation.result).toBe(EvaluationResult.DISABLED);
      expect(evaluation.isEnabled).toBe(false);
      expect(evaluation.reason).toContain('KillSwitchActive');
    });

    it('should allocate A/B testing variants deterministically for experiment flags', async () => {
      const evaluation = await platformService.evaluateFeature({
        featureKey: 'experiment.checkout.ui_redesign',
        context: { tenantId: 'tenant-default', userId: 'user-shopper-77' },
      });

      expect(evaluation.result).toBe(EvaluationResult.ENABLED);
      expect(evaluation.assignedVariant).toBeDefined();
      expect(['var-a', 'var-b']).toContain(evaluation.assignedVariant?.variantId);
    });

    it('should enforce Tenant RLS Isolation', async () => {
      const created = await platformService.createFeature('tenant-alpha-flag', {
        key: 'feature.secret.alpha',
        flagType: FlagType.PREMIUM_FEATURE,
      });

      await expect(
        platformService.getFeatureById('tenant-beta-flag', created.id)
      ).rejects.toThrow(UnauthorizedFeatureAccessException);
    });

    it('should query Experiment Catalog, Rollout History, Audience Catalog, and Statistics read models', async () => {
      const experiments = await platformService.getExperimentCatalog('tenant-default');
      expect(experiments.totalExperiments).toBe(1);

      const rollouts = await platformService.getRolloutHistory('tenant-default');
      expect(rollouts.totalRolloutEvents).toBeGreaterThan(0);

      const audiences = await platformService.getAudienceCatalog('tenant-default');
      expect(audiences.totalSegments).toBe(3);

      const stats = await platformService.getStatistics('tenant-default');
      expect(stats.totalFlags).toBe(8);
      expect(stats.cacheHitRatioPercentage).toBeGreaterThan(95);
    });
  });
});
