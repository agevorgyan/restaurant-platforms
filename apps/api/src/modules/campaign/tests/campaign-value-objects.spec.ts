import { CampaignId } from '../domain/value-objects/campaign-id.value-object';
import { CampaignName } from '../domain/value-objects/campaign-name.value-object';
import { CampaignType, CampaignTypeEnum } from '../domain/value-objects/campaign-type.value-object';
import { CampaignBudget } from '../domain/value-objects/campaign-budget.value-object';
import { CampaignSchedule } from '../domain/value-objects/campaign-schedule.value-object';
import { CampaignStatus, CampaignStatusEnum } from '../domain/value-objects/campaign-status.value-object';

describe('Campaign Value Objects', () => {
  describe('CampaignId', () => {
    it('should create a valid CampaignId', () => {
      const id = CampaignId.create('id-123');
      expect(id.value).toBe('id-123');
    });

    it('should throw an error for empty id', () => {
      expect(() => CampaignId.create('')).toThrow('CampaignId cannot be empty');
      expect(() => CampaignId.create('   ')).toThrow('CampaignId cannot be empty');
    });
  });

  describe('CampaignName', () => {
    it('should create a valid CampaignName', () => {
      const name = CampaignName.create('Summer Sale');
      expect(name.value).toBe('Summer Sale');
    });

    it('should throw an error for empty name', () => {
      expect(() => CampaignName.create('')).toThrow('Campaign name cannot be empty');
    });
  });

  describe('CampaignType', () => {
    it('should create a valid CampaignType', () => {
      const type = CampaignType.create(CampaignTypeEnum.DISCOUNT);
      expect(type.value).toBe(CampaignTypeEnum.DISCOUNT);
    });

    it('should throw an error for invalid type', () => {
      expect(() => CampaignType.create('INVALID')).toThrow('Invalid CampaignType: INVALID');
    });
  });

  describe('CampaignBudget', () => {
    it('should create a valid CampaignBudget', () => {
      const budget = CampaignBudget.create(1000, 'USD');
      expect(budget.amount).toBe(1000);
      expect(budget.currency).toBe('USD');
    });

    it('should throw an error for negative amount', () => {
      expect(() => CampaignBudget.create(-100)).toThrow('Campaign budget cannot be negative');
    });

    it('should default to USD if currency is not provided', () => {
      const budget = CampaignBudget.create(500);
      expect(budget.currency).toBe('USD');
    });
  });

  describe('CampaignSchedule', () => {
    it('should create a valid CampaignSchedule', () => {
      const start = new Date('2030-01-01T00:00:00Z');
      const end = new Date('2030-01-31T23:59:59Z');
      const schedule = CampaignSchedule.create(start, end);
      expect(schedule.startDate).toEqual(start);
      expect(schedule.endDate).toEqual(end);
    });

    it('should throw an error if start date is after end date', () => {
      const start = new Date('2030-01-31T23:59:59Z');
      const end = new Date('2030-01-01T00:00:00Z');
      expect(() => CampaignSchedule.create(start, end)).toThrow('Start date must be before end date');
    });
  });

  describe('CampaignStatus', () => {
    it('should create initial status as DRAFT', () => {
      const status = CampaignStatus.initial();
      expect(status.value).toBe(CampaignStatusEnum.DRAFT);
      expect(status.isDraft()).toBe(true);
    });
  });
});
