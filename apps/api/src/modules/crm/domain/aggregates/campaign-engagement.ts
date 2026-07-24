import { AggregateRoot } from '@saas/domain';
import {
  CampaignEngagementId,
  CampaignReference,
  TargetReference,
  EngagementStatus,
  EngagementStatusEnum,
  EngagementScore,
  FirstEngagementAt,
  LastEngagementAt,
  ConversionStatus,
  ConversionStatusEnum
} from '../value-objects/campaign-engagement-core';
import { CampaignResponse } from '../entities/campaign-response';
import { ClickEvent } from '../entities/campaign-click-event';
import { OpenEvent } from '../entities/campaign-open-event';
import { VisitEvent } from '../entities/campaign-visit-event';
import { ConversionEvent } from '../entities/campaign-conversion-event';
import { UnsubscribeRecord } from '../entities/campaign-unsubscribe-record';
import { BounceRecord } from '../entities/campaign-bounce-record';
import { EngagementHistoryEntry } from '../entities/engagement-history-entry';
import {
  CampaignEngagementCreated,
  CampaignOpened,
  CampaignClicked,
  CampaignVisited,
  CampaignConverted,
  CampaignUnsubscribed,
  CampaignEngagementClosed,
  CampaignEngagementArchived
} from '../events/campaign-engagement-events';
import { 
  EngagementTimelineSpecification, 
  ConversionSpecification,
  ResponseSpecification 
} from '../rules/crm-rules';
import { EngagementScoringService } from '../services/crm-services';

export class CampaignEngagement extends AggregateRoot<CampaignEngagementId> {
  private _status: EngagementStatus;
  private _score: EngagementScore;
  private _firstEngagementAt: FirstEngagementAt | null = null;
  private _lastEngagementAt: LastEngagementAt | null = null;
  private _conversionStatus: ConversionStatus;
  
  private _responses: CampaignResponse[] = [];
  private _clicks: ClickEvent[] = [];
  private _opens: OpenEvent[] = [];
  private _visits: VisitEvent[] = [];
  private _conversions: ConversionEvent[] = [];
  private _unsubscribes: UnsubscribeRecord[] = [];
  private _bounces: BounceRecord[] = [];
  private _history: EngagementHistoryEntry[] = [];

  constructor(
    id: CampaignEngagementId,
    public readonly campaignReference: CampaignReference,
    public readonly targetReference: TargetReference,
    status: EngagementStatus = EngagementStatus.create(EngagementStatusEnum.ACTIVE),
    score: EngagementScore = EngagementScore.create(0),
    conversionStatus: ConversionStatus = ConversionStatus.create(ConversionStatusEnum.NOT_CONVERTED)
  ) {
    super(id);
    this._status = status;
    this._score = score;
    this._conversionStatus = conversionStatus;
  }

  public static create(
    campaignReference: string,
    targetReference: string
  ): CampaignEngagement {
    const id = CampaignEngagementId.generate();
    
    const engagement = new CampaignEngagement(
      id,
      CampaignReference.create(campaignReference),
      TargetReference.create(targetReference)
    );

    engagement._history.push(EngagementHistoryEntry.create('CREATED', 'Engagement created.'));

    engagement.record(new CampaignEngagementCreated(id.toValue(), engagement.version(), {
      engagementId: id.toValue(),
      campaignReference,
      targetReference
    }));

    return engagement;
  }

  get status(): EngagementStatus { return this._status; }
  get score(): EngagementScore { return this._score; }
  get conversionStatus(): ConversionStatus { return this._conversionStatus; }
  get firstEngagementAt(): FirstEngagementAt | null { return this._firstEngagementAt; }
  get lastEngagementAt(): LastEngagementAt | null { return this._lastEngagementAt; }

  public registerResponse(
    responseType: string, 
    source: string, 
    scoringService: EngagementScoringService,
    spec: ResponseSpecification,
    timelineSpec: EngagementTimelineSpecification,
    details?: string
  ): void {
    this.assertMutable();
    
    if (!spec.isSatisfiedBy({ responseType })) {
      throw new Error(`Invalid response type: ${responseType}`);
    }

    const now = new Date();
    if (!timelineSpec.isSatisfiedBy({ newEventTime: now, lastEventTime: this._lastEngagementAt?.toValue() || null })) {
      throw new Error('Events must remain chronological.');
    }

    this._responses.push(CampaignResponse.create(responseType, source, details));
    this.updateEngagementTimestamps(now);
    
    const adjustment = scoringService.calculateScoreAdjustment(responseType);
    this._score = EngagementScore.create(Math.max(0, this._score.toValue() + adjustment));

    this._history.push(EngagementHistoryEntry.create('RESPONSE_REGISTERED', `Response registered: ${responseType}`));
  }

  public registerOpen(userAgent: string, ipAddress?: string): void {
    this.assertMutable();
    const now = new Date();
    this._opens.push(OpenEvent.create(userAgent, ipAddress));
    this.updateEngagementTimestamps(now);
    
    this._history.push(EngagementHistoryEntry.create('OPEN_REGISTERED', 'Campaign opened.'));

    this.record(new CampaignOpened(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue(),
      userAgent
    }));
  }

  public registerClick(linkId: string, url: string, userAgent: string, ipAddress?: string): void {
    this.assertMutable();
    const now = new Date();
    this._clicks.push(ClickEvent.create(linkId, url, userAgent, ipAddress));
    this.updateEngagementTimestamps(now);
    
    this._history.push(EngagementHistoryEntry.create('CLICK_REGISTERED', `Clicked link: ${linkId}`));

    this.record(new CampaignClicked(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue(),
      linkId,
      url
    }));
  }

  public registerVisit(pageUrl: string, durationSeconds: number, referrer?: string): void {
    this.assertMutable();
    const now = new Date();
    this._visits.push(VisitEvent.create(pageUrl, durationSeconds, referrer));
    this.updateEngagementTimestamps(now);
    
    this._history.push(EngagementHistoryEntry.create('VISIT_REGISTERED', `Visited: ${pageUrl}`));

    this.record(new CampaignVisited(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue(),
      pageUrl
    }));
  }

  public registerConversion(
    conversionType: string, 
    value: number, 
    currency: string, 
    spec: ConversionSpecification,
    relatedEntityId?: string
  ): void {
    this.assertMutable();
    
    if (!spec.isSatisfiedBy({ isAlreadyConverted: this._conversionStatus.toValue() === ConversionStatusEnum.CONVERTED })) {
      throw new Error('Engagement already converted.');
    }

    const now = new Date();
    this._conversions.push(ConversionEvent.create(conversionType, value, currency, relatedEntityId));
    this._conversionStatus = ConversionStatus.create(ConversionStatusEnum.CONVERTED);
    this.updateEngagementTimestamps(now);
    
    this._history.push(EngagementHistoryEntry.create('CONVERSION_REGISTERED', `Conversion: ${conversionType}`));

    this.record(new CampaignConverted(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue(),
      conversionType,
      value
    }));
  }

  public registerUnsubscribe(reason: string, feedback?: string): void {
    this.assertMutable();
    const now = new Date();
    this._unsubscribes.push(UnsubscribeRecord.create(reason, feedback));
    this.updateEngagementTimestamps(now);
    
    this._history.push(EngagementHistoryEntry.create('UNSUBSCRIBED', `Unsubscribed: ${reason}`));

    this.record(new CampaignUnsubscribed(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue(),
      reason
    }));
  }

  public close(): void {
    this.assertMutable();

    this._status = EngagementStatus.create(EngagementStatusEnum.CLOSED);
    this._history.push(EngagementHistoryEntry.create('CLOSED', 'Engagement closed.'));

    this.record(new CampaignEngagementClosed(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue()
    }));
  }

  public archive(): void {
    if (this._status.toValue() === EngagementStatusEnum.ARCHIVED) return;

    this._status = EngagementStatus.create(EngagementStatusEnum.ARCHIVED);
    this._history.push(EngagementHistoryEntry.create('ARCHIVED', 'Engagement archived.'));

    this.record(new CampaignEngagementArchived(this.id.toValue(), this.version(), {
      engagementId: this.id.toValue()
    }));
  }

  private updateEngagementTimestamps(date: Date): void {
    if (!this._firstEngagementAt) {
      this._firstEngagementAt = FirstEngagementAt.create(date);
    }
    this._lastEngagementAt = LastEngagementAt.create(date);
  }

  private assertMutable(): void {
    if (this._status.toValue() === EngagementStatusEnum.CLOSED) {
      throw new Error('Closed engagements cannot be modified.');
    }
    if (this._status.toValue() === EngagementStatusEnum.ARCHIVED) {
      throw new Error('Archived engagements are immutable.');
    }
  }
}
