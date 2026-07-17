import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { AvailabilityTimeRange } from './availability-time-range.value-object';
import { AvailabilityDay } from './availability-day.value-object';
import { AvailabilitySchedule } from './availability-schedule.value-object';
import { ProductAvailabilityPolicy } from './product-availability-policy.value-object';

describe('Product Availability Domain Value Objects', () => {
  describe('AvailabilityTimeRange', () => {
    it('should create a valid time range', () => {
      const range = new AvailabilityTimeRange('09:00', '17:00');
      assert.strictEqual(range.startTime, '09:00');
      assert.strictEqual(range.endTime, '17:00');
    });

    it('should throw on invalid time format', () => {
      assert.throws(() => new AvailabilityTimeRange('9:00', '17:00'), /Invalid startTime format/);
      assert.throws(() => new AvailabilityTimeRange('09:00', '25:00'), /Invalid endTime format/);
    });

    it('should throw if start time is not earlier than end time', () => {
      assert.throws(() => new AvailabilityTimeRange('17:00', '09:00'), /Start time must be earlier than end time/);
      assert.throws(() => new AvailabilityTimeRange('12:00', '12:00'), /Start time must be earlier than end time/);
    });

    it('should detect overlapping time ranges', () => {
      const range1 = new AvailabilityTimeRange('09:00', '12:00');
      const range2 = new AvailabilityTimeRange('11:00', '14:00');
      const range3 = new AvailabilityTimeRange('12:00', '15:00');

      assert.strictEqual(range1.overlapsWith(range2), true); // 09-12 and 11-14 overlap
      assert.strictEqual(range1.overlapsWith(range3), false); // 09-12 and 12-15 do not overlap (adjacent)
    });
  });

  describe('AvailabilityDay', () => {
    it('should create a valid day', () => {
      const day = new AvailabilityDay('Monday');
      assert.strictEqual(day.value, 'Monday');
    });

    it('should throw on invalid day', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new AvailabilityDay('Funday'), /Invalid Availability Day/);
    });
  });

  describe('AvailabilitySchedule', () => {
    it('should create a valid schedule', () => {
      const days = [new AvailabilityDay('Monday')];
      const ranges = [new AvailabilityTimeRange('09:00', '12:00'), new AvailabilityTimeRange('13:00', '17:00')];
      const schedule = new AvailabilitySchedule(days, ranges);
      
      assert.strictEqual(schedule.daysOfWeek.length, 1);
      assert.strictEqual(schedule.timeRanges.length, 2);
    });

    it('should throw if time ranges overlap', () => {
      const days = [new AvailabilityDay('Monday')];
      const ranges = [new AvailabilityTimeRange('09:00', '13:00'), new AvailabilityTimeRange('12:00', '17:00')];
      
      assert.throws(() => new AvailabilitySchedule(days, ranges), /Time ranges must not overlap/);
    });
  });

  describe('ProductAvailabilityPolicy', () => {
    it('should enforce Always availability rule', () => {
      assert.throws(() => new ProductAvailabilityPolicy('Always', false, true, false, 1, 'UTC'), /When availabilityMode is Always, alwaysAvailable must be true/);
    });

    it('should enforce Scheduled availability rules', () => {
      assert.throws(() => new ProductAvailabilityPolicy('Scheduled', false, true, false, 1, 'UTC'), /Schedule is required when availabilityMode is Scheduled/);
    });

    it('should enforce Seasonal availability rules', () => {
      assert.throws(() => new ProductAvailabilityPolicy('Seasonal', false, true, true, 1, 'UTC'), /startDate and endDate are required when availabilityMode is Seasonal/);
      
      const start = new Date('2025-12-01');
      const end = new Date('2025-11-01');
      assert.throws(() => new ProductAvailabilityPolicy('Seasonal', false, true, true, 1, 'UTC', [], start, end), /End date must not be before start date/);
    });

    it('should validate timezone', () => {
      assert.throws(() => new ProductAvailabilityPolicy('Manual', false, true, false, 1, 'Invalid/Timezone'), /Invalid IANA timezone/);
    });

    it('should create a valid policy', () => {
      const policy = new ProductAvailabilityPolicy('Manual', false, true, false, 1, 'America/New_York');
      assert.strictEqual(policy.availabilityMode, 'Manual');
      assert.strictEqual(policy.timezone, 'America/New_York');
    });
  });
});
