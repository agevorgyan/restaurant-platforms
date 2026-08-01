/**
 * Enterprise Feature Flag Platform - Domain Aggregate Root
 *
 * FeatureFlagAggregate encapsulates feature flag identity, dot-separated key hierarchy,
 * lifecycle state machine (DRAFT -> ACTIVE -> PAUSED -> DEPRECATED -> ARCHIVED), targeting rules,
 * percentage & canary rollout policies, variants, emergency kill switches, and domain event publishing.
 */

import { FeatureStatus, FlagType, RolloutType } from '../enums/feature-flag.enums';
import {
  FeatureFlagId,
  FeatureKey,
  FeatureVersion,
  RolloutPolicy,
  TargetRule,
  Variant,
} from '../value-objects/feature-flag-vo';
import { BasePlatformDomainEvent } from '../events/health.events';
import {
  FeatureActivatedEvent,
  FeatureCreatedEvent,
  KillSwitchActivatedEvent,
  RolloutCompletedEvent,
  RolloutStartedEvent,
} from '../events/feature-flag.events';

export interface CreateFeatureFlagProps {
  key: string;
  flagType: FlagType;
  tenantId: string;
  targetRules?: TargetRule[];
  rolloutPolicy?: RolloutPolicy;
  variants?: Variant[];
  description?: string;
  tags?: string[];
  createdBy?: string;
}

export class FeatureFlagAggregate {
  private readonly id: FeatureFlagId;
  private readonly tenantId: string;
  private key: FeatureKey;
  private version: FeatureVersion;
  private flagType: FlagType;
  private status: FeatureStatus;
  private targetRules: TargetRule[];
  private rolloutPolicy: RolloutPolicy;
  private variants: Variant[];
  private isKillSwitchActive: boolean;
  private killSwitchReason?: string;
  private description?: string;
  private tags: string[];
  private createdBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BasePlatformDomainEvent[] = [];

  private constructor(props: {
    id: FeatureFlagId;
    tenantId: string;
    key: FeatureKey;
    version: FeatureVersion;
    flagType: FlagType;
    status: FeatureStatus;
    targetRules?: TargetRule[];
    rolloutPolicy?: RolloutPolicy;
    variants?: Variant[];
    isKillSwitchActive?: boolean;
    killSwitchReason?: string;
    description?: string;
    tags?: string[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.key = props.key;
    this.version = props.version;
    this.flagType = props.flagType;
    this.status = props.status;
    this.targetRules = props.targetRules || [];
    this.rolloutPolicy = props.rolloutPolicy || RolloutPolicy.full();
    this.variants = props.variants || [];
    this.isKillSwitchActive = props.isKillSwitchActive ?? false;
    this.killSwitchReason = props.killSwitchReason;
    this.description = props.description;
    this.tags = props.tags || [];
    this.createdBy = props.createdBy || 'system';
    this.updatedBy = props.updatedBy || props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to create a new FeatureFlagAggregate in DRAFT status
   */
  public static create(props: CreateFeatureFlagProps): FeatureFlagAggregate {
    const id = FeatureFlagId.create();
    const key = FeatureKey.create(props.key);
    const version = FeatureVersion.initial();

    const aggregate = new FeatureFlagAggregate({
      id,
      tenantId: props.tenantId,
      key,
      version,
      flagType: props.flagType,
      status: FeatureStatus.DRAFT,
      targetRules: props.targetRules,
      rolloutPolicy: props.rolloutPolicy,
      variants: props.variants,
      description: props.description,
      tags: props.tags,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new FeatureCreatedEvent(
        id.getValue(),
        props.tenantId,
        key.getValue(),
        props.flagType,
        version.toString()
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: FeatureFlagId;
    tenantId: string;
    key: FeatureKey;
    version: FeatureVersion;
    flagType: FlagType;
    status: FeatureStatus;
    targetRules: TargetRule[];
    rolloutPolicy: RolloutPolicy;
    variants: Variant[];
    isKillSwitchActive: boolean;
    killSwitchReason?: string;
    description?: string;
    tags: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): FeatureFlagAggregate {
    return new FeatureFlagAggregate(props);
  }

  // Getters
  public getId(): FeatureFlagId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getKey(): FeatureKey {
    return this.key;
  }

  public getVersion(): FeatureVersion {
    return this.version;
  }

  public getFlagType(): FlagType {
    return this.flagType;
  }

  public getStatus(): FeatureStatus {
    return this.status;
  }

  public getTargetRules(): TargetRule[] {
    return [...this.targetRules];
  }

  public getRolloutPolicy(): RolloutPolicy {
    return this.rolloutPolicy;
  }

  public getVariants(): Variant[] {
    return [...this.variants];
  }

  public getIsKillSwitchActive(): boolean {
    return this.isKillSwitchActive;
  }

  public getKillSwitchReason(): string | undefined {
    return this.killSwitchReason;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getUpdatedBy(): string {
    return this.updatedBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Domain Mutations
  public activate(activatedBy: string = 'system'): void {
    this.status = FeatureStatus.ACTIVE;
    this.updatedBy = activatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new FeatureActivatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.key.getValue(),
        activatedBy
      )
    );
  }

  public updateStatus(status: FeatureStatus, updatedBy: string = 'system'): void {
    this.status = status;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public updateTargetRules(targetRules: TargetRule[], updatedBy: string = 'system'): void {
    this.targetRules = targetRules;
    this.version = this.version.incrementMinor();
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public updateRolloutPolicy(policy: RolloutPolicy, updatedBy: string = 'system'): void {
    this.rolloutPolicy = policy;
    this.version = this.version.incrementMinor();
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    if (policy.percentage.value === 100.0) {
      this.addDomainEvent(
        new RolloutCompletedEvent(
          this.id.getValue(),
          this.tenantId,
          this.key.getValue(),
          100.0
        )
      );
    } else {
      this.addDomainEvent(
        new RolloutStartedEvent(
          this.id.getValue(),
          this.tenantId,
          this.key.getValue(),
          policy.rolloutType,
          policy.percentage.value
        )
      );
    }
  }

  public triggerKillSwitch(activatedBy: string, reason: string): void {
    this.isKillSwitchActive = true;
    this.killSwitchReason = reason;
    this.updatedBy = activatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new KillSwitchActivatedEvent(
        this.id.getValue(),
        this.tenantId,
        this.key.getValue(),
        activatedBy,
        reason
      )
    );
  }

  public deactivateKillSwitch(deactivatedBy: string): void {
    this.isKillSwitchActive = false;
    this.killSwitchReason = undefined;
    this.updatedBy = deactivatedBy;
    this.updatedAt = new Date();
  }

  // Events Management
  private addDomainEvent(event: BasePlatformDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BasePlatformDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
