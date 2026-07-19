import { DomainEvent } from '../base/domain-event';

export class CampaignCreated implements DomainEvent {
  public dateTimeOccurred: Date;

  constructor(
    public readonly campaignId: string,
    public readonly name: string,
    public readonly type: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.campaignId;
  }
}

export class CampaignActivated implements DomainEvent {
  public dateTimeOccurred: Date;

  constructor(public readonly campaignId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.campaignId;
  }
}

export class CampaignPaused implements DomainEvent {
  public dateTimeOccurred: Date;

  constructor(public readonly campaignId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.campaignId;
  }
}

export class CampaignCompleted implements DomainEvent {
  public dateTimeOccurred: Date;

  constructor(public readonly campaignId: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.campaignId;
  }
}

export class CampaignCancelled implements DomainEvent {
  public dateTimeOccurred: Date;

  constructor(public readonly campaignId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.campaignId;
  }
}
