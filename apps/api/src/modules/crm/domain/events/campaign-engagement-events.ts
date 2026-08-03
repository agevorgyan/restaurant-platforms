import { DomainEvent } from '@saas/events';
import { EventMetadata, createEventMetadata } from '@saas/events';

export class CampaignEngagementCreated extends DomainEvent<{ engagementId: string, campaignReference: string, targetReference: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, campaignReference: string, targetReference: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignEngagementCreated', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignOpened extends DomainEvent<{ engagementId: string, userAgent: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, userAgent: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignOpened', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignClicked extends DomainEvent<{ engagementId: string, linkId: string, url: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, linkId: string, url: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignClicked', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignVisited extends DomainEvent<{ engagementId: string, pageUrl: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, pageUrl: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignVisited', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignConverted extends DomainEvent<{ engagementId: string, conversionType: string, value: number }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, conversionType: string, value: number }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignConverted', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignUnsubscribed extends DomainEvent<{ engagementId: string, reason: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string, reason: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignUnsubscribed', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignEngagementClosed extends DomainEvent<{ engagementId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignEngagementClosed', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}

export class CampaignEngagementArchived extends DomainEvent<{ engagementId: string }> {
  constructor(aggregateId: string, aggregateVersion: number, payload: { engagementId: string }, metadata: EventMetadata = createEventMetadata() as any) {
    super(crypto.randomUUID(), 'CampaignEngagementArchived', aggregateId, 'CampaignEngagement', aggregateVersion, new Date(), payload, metadata);
  }
}
