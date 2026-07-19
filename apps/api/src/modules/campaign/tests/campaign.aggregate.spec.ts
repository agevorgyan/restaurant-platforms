import { Campaign } from '../domain/aggregates/campaign.aggregate';
import { CampaignId } from '../domain/value-objects/campaign-id.value-object';
import { CampaignName } from '../domain/value-objects/campaign-name.value-object';
import { CampaignType, CampaignTypeEnum } from '../domain/value-objects/campaign-type.value-object';
import { CampaignBudget } from '../domain/value-objects/campaign-budget.value-object';
import { CampaignSchedule } from '../domain/value-objects/campaign-schedule.value-object';
import { CampaignTarget } from '../domain/entities/campaign-target.entity';

describe('Campaign Aggregate', () => {
  let validCampaign: Campaign;
  const startDate = new Date('2030-01-01T00:00:00Z');
  const endDate = new Date('2030-01-31T23:59:59Z');

  beforeEach(() => {
    validCampaign = Campaign.create(
      CampaignId.create('campaign-1'),
      CampaignName.create('New Year Promo'),
      CampaignType.create(CampaignTypeEnum.DISCOUNT),
      CampaignBudget.create(5000),
      CampaignSchedule.create(startDate, endDate),
      CampaignTarget.create('target-1', { audienceSegmentIds: ['seg-1'] })
    );
  });

  it('should create a new campaign in DRAFT status', () => {
    expect(validCampaign.status.isDraft()).toBe(true);
    expect(validCampaign.domainEvents.length).toBe(1); // CampaignCreated event
    expect(validCampaign.domainEvents[0].constructor.name).toBe('CampaignCreated');
  });

  describe('State Transitions', () => {
    it('should activate a draft campaign', () => {
      validCampaign.activate();
      expect(validCampaign.status.isActive()).toBe(true);
      expect(validCampaign.domainEvents[1].constructor.name).toBe('CampaignActivated');
    });

    it('should throw an error when activating an already active campaign', () => {
      validCampaign.activate();
      expect(() => validCampaign.activate()).toThrow('Only Draft campaigns may be activated.');
    });

    it('should pause an active campaign', () => {
      validCampaign.activate();
      validCampaign.pause();
      expect(validCampaign.status.isPaused()).toBe(true);
      expect(validCampaign.domainEvents[2].constructor.name).toBe('CampaignPaused');
    });

    it('should throw an error when pausing a draft campaign', () => {
      expect(() => validCampaign.pause()).toThrow('Only Active campaigns may be paused.');
    });

    it('should complete a campaign', () => {
      validCampaign.activate();
      validCampaign.complete();
      expect(validCampaign.status.isCompleted()).toBe(true);
      expect(validCampaign.domainEvents[2].constructor.name).toBe('CampaignCompleted');
    });

    it('should throw an error when completing a cancelled campaign', () => {
      validCampaign.cancel('Change of plans');
      expect(() => validCampaign.complete()).toThrow('Cancelled campaigns cannot be completed.');
    });

    it('should cancel a campaign', () => {
      validCampaign.cancel('Not needed anymore');
      expect(validCampaign.status.isCancelled()).toBe(true);
      expect(validCampaign.domainEvents[1].constructor.name).toBe('CampaignCancelled');
    });

    it('should throw an error when cancelling a completed campaign', () => {
      validCampaign.activate();
      validCampaign.complete();
      expect(() => validCampaign.cancel('Too late')).toThrow('Completed campaigns cannot be cancelled.');
    });

    it('should resume a paused campaign', () => {
      validCampaign.activate();
      validCampaign.pause();
      validCampaign.resume();
      expect(validCampaign.status.isActive()).toBe(true);
    });

    it('should throw an error when resuming a non-paused campaign', () => {
      expect(() => validCampaign.resume()).toThrow('Only Paused campaigns may be resumed.');
    });
  });

  describe('Business Rules', () => {
    it('should update budget for a draft campaign', () => {
      const newBudget = CampaignBudget.create(6000);
      validCampaign.updateBudget(newBudget);
      expect(validCampaign.budget.amount).toBe(6000);
    });

    it('should throw an error when updating budget for a completed campaign', () => {
      validCampaign.activate();
      validCampaign.complete();
      const newBudget = CampaignBudget.create(6000);
      expect(() => validCampaign.updateBudget(newBudget)).toThrow('Completed campaigns cannot be modified.');
    });

    it('should only record metrics for active campaigns', () => {
      validCampaign.recordImpression(); // Draft
      expect(validCampaign.metrics.impressions).toBe(0);

      validCampaign.activate();
      validCampaign.recordImpression(); // Active
      expect(validCampaign.metrics.impressions).toBe(1);

      validCampaign.pause();
      validCampaign.recordClick(); // Paused
      expect(validCampaign.metrics.clicks).toBe(0);

      validCampaign.resume();
      validCampaign.recordClick(); // Active again
      validCampaign.recordConversion(100);
      expect(validCampaign.metrics.clicks).toBe(1);
      expect(validCampaign.metrics.conversions).toBe(1);
      expect(validCampaign.metrics.revenueGenerated).toBe(100);
    });
  });
});
