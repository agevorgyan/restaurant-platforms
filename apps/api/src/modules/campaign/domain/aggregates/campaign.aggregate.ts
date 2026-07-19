import { AggregateRoot } from '@saas/core';
import { CampaignId } from '../value-objects/campaign-id.value-object';
import { CampaignName } from '../value-objects/campaign-name.value-object';
import { CampaignType } from '../value-objects/campaign-type.value-object';
import { CampaignStatus, CampaignStatusEnum } from '../value-objects/campaign-status.value-object';
import { CampaignBudget } from '../value-objects/campaign-budget.value-object';
import { CampaignSchedule } from '../value-objects/campaign-schedule.value-object';
import { CampaignTarget } from '../entities/campaign-target.entity';
import { CampaignMetrics } from '../entities/campaign-metrics.entity';
import {
  CampaignActivated,
  CampaignCancelled,
  CampaignCompleted,
  CampaignCreated,
  CampaignPaused,
} from '../events/campaign-events';

export interface CampaignProps {
  campaignId: CampaignId;
  name: CampaignName;
  type: CampaignType;
  status: CampaignStatus;
  budget: CampaignBudget;
  schedule: CampaignSchedule;
  target: CampaignTarget;
  metrics: CampaignMetrics;
}

export class Campaign extends AggregateRoot<CampaignProps> {
  private constructor(props: CampaignProps) {
    super(props.campaignId.value, props);
  }

  public static create(
    id: CampaignId,
    name: CampaignName,
    type: CampaignType,
    budget: CampaignBudget,
    schedule: CampaignSchedule,
    target: CampaignTarget
  ): Campaign {
    const status = CampaignStatus.initial();
    const metrics = CampaignMetrics.create(id.value);

    const campaign = new Campaign({
      campaignId: id,
      name,
      type,
      status,
      budget,
      schedule,
      target,
      metrics,
    });

    campaign.addDomainEvent(new CampaignCreated(id.value, name.value, type.value));

    return campaign;
  }

  // Getters for properties
  get campaignId(): CampaignId { return this.props.campaignId; }
  get name(): CampaignName { return this.props.name; }
  get type(): CampaignType { return this.props.type; }
  get status(): CampaignStatus { return this.props.status; }
  get budget(): CampaignBudget { return this.props.budget; }
  get schedule(): CampaignSchedule { return this.props.schedule; }
  get target(): CampaignTarget { return this.props.target; }
  get metrics(): CampaignMetrics { return this.props.metrics; }

  // Business logic

  public activate(): void {
    if (!this.props.status.isDraft()) {
      throw new Error('Only Draft campaigns may be activated.');
    }
    this.props.status = CampaignStatus.create(CampaignStatusEnum.ACTIVE);
    this.addDomainEvent(new CampaignActivated(this.id));
  }

  public pause(): void {
    if (!this.props.status.isActive()) {
      throw new Error('Only Active campaigns may be paused.');
    }
    this.props.status = CampaignStatus.create(CampaignStatusEnum.PAUSED);
    this.addDomainEvent(new CampaignPaused(this.id));
  }

  public complete(): void {
    if (this.props.status.isCompleted()) {
      throw new Error('Campaign is already completed.');
    }
    if (this.props.status.isCancelled()) {
      throw new Error('Cancelled campaigns cannot be completed.');
    }
    this.props.status = CampaignStatus.create(CampaignStatusEnum.COMPLETED);
    this.addDomainEvent(new CampaignCompleted(this.id));
  }

  public cancel(reason?: string): void {
    if (this.props.status.isCompleted()) {
      throw new Error('Completed campaigns cannot be cancelled.');
    }
    if (this.props.status.isCancelled()) {
      throw new Error('Campaign is already cancelled.');
    }
    this.props.status = CampaignStatus.create(CampaignStatusEnum.CANCELLED);
    this.addDomainEvent(new CampaignCancelled(this.id, reason));
  }

  public resume(): void {
    if (!this.props.status.isPaused()) {
      throw new Error('Only Paused campaigns may be resumed.');
    }
    this.props.status = CampaignStatus.create(CampaignStatusEnum.ACTIVE);
    this.addDomainEvent(new CampaignActivated(this.id));
  }

  public updateBudget(newBudget: CampaignBudget): void {
    if (this.props.status.isCompleted()) {
      throw new Error('Completed campaigns cannot be modified.');
    }
    if (this.props.status.isCancelled()) {
      throw new Error('Cancelled campaigns cannot be modified.');
    }
    this.props.budget = newBudget;
  }

  public updateSchedule(newSchedule: CampaignSchedule): void {
    if (this.props.status.isCompleted()) {
      throw new Error('Completed campaigns cannot be modified.');
    }
    if (this.props.status.isCancelled()) {
      throw new Error('Cancelled campaigns cannot be modified.');
    }
    this.props.schedule = newSchedule;
  }

  // Metrics delegation
  public recordImpression(): void {
    if (this.props.status.isActive()) {
      this.props.metrics.recordImpression();
    }
  }

  public recordClick(): void {
    if (this.props.status.isActive()) {
      this.props.metrics.recordClick();
    }
  }

  public recordConversion(revenue: number): void {
    if (this.props.status.isActive()) {
      this.props.metrics.recordConversion(revenue);
    }
  }
}
