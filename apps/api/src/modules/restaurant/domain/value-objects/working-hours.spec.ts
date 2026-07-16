import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { OpeningPeriod } from './opening-period.value-object';
import { BusinessDay } from './business-day.value-object';
import { WorkingHours } from './working-hours.value-object';

describe('WorkingHours Value Objects', () => {
  describe('OpeningPeriod', () => {
    it('should create a valid period', () => {
      const period = new OpeningPeriod('09:00', '17:00');
      assert.strictEqual(period.opensAt, '09:00');
      assert.strictEqual(period.closesAt, '17:00');
    });

    it('should throw on invalid time format', () => {
      assert.throws(() => new OpeningPeriod('9:00', '17:00'));
      assert.throws(() => new OpeningPeriod('24:00', '17:00'));
      assert.throws(() => new OpeningPeriod('09:00', '17:60'));
    });

    it('should throw if closing time is before or equal to opening time', () => {
      assert.throws(() => new OpeningPeriod('17:00', '09:00'));
      assert.throws(() => new OpeningPeriod('09:00', '09:00'));
    });

    it('should correctly identify overlaps', () => {
      const p1 = new OpeningPeriod('09:00', '12:00');
      const p2 = new OpeningPeriod('11:00', '14:00');
      const p3 = new OpeningPeriod('12:00', '14:00');

      assert.strictEqual(p1.overlaps(p2), true);
      assert.strictEqual(p2.overlaps(p1), true);
      assert.strictEqual(p1.overlaps(p3), false); // Adjacent is not overlap
    });
  });

  describe('BusinessDay', () => {
    it('should create a valid open day', () => {
      const day = new BusinessDay(1, false, false, [new OpeningPeriod('09:00', '17:00')]);
      assert.strictEqual(day.isOpen(), true);
    });

    it('should create a valid closed day', () => {
      const day = new BusinessDay(0, true, false);
      assert.strictEqual(day.isOpen(), false);
    });

    it('should create a valid 24h day', () => {
      const day = new BusinessDay(1, false, true);
      assert.strictEqual(day.isOpen(), true);
    });

    it('should throw if closed and 24h', () => {
      assert.throws(() => new BusinessDay(1, true, true));
    });

    it('should throw if closed but has periods', () => {
      assert.throws(() => new BusinessDay(1, true, false, [new OpeningPeriod('09:00', '17:00')]));
    });

    it('should throw if 24h but has periods', () => {
      assert.throws(() => new BusinessDay(1, false, true, [new OpeningPeriod('09:00', '17:00')]));
    });

    it('should throw if overlapping periods', () => {
      const p1 = new OpeningPeriod('09:00', '12:00');
      const p2 = new OpeningPeriod('11:00', '14:00');
      assert.throws(() => new BusinessDay(1, false, false, [p1, p2]));
    });

    it('should throw if more than 5 periods', () => {
      const periods = [
        new OpeningPeriod('01:00', '02:00'),
        new OpeningPeriod('03:00', '04:00'),
        new OpeningPeriod('05:00', '06:00'),
        new OpeningPeriod('07:00', '08:00'),
        new OpeningPeriod('09:00', '10:00'),
        new OpeningPeriod('11:00', '12:00'),
      ];
      assert.throws(() => new BusinessDay(1, false, false, periods));
    });
  });

  describe('WorkingHours', () => {
    const createValidWeek = () => {
      const days: BusinessDay[] = [];
      for (let i = 0; i < 7; i++) {
        days.push(new BusinessDay(i, false, true)); // Open 24h every day
      }
      return days;
    };

    it('should create a valid WorkingHours instance', () => {
      const wh = new WorkingHours(createValidWeek());
      assert.strictEqual(wh.isOpen(0), true);
      assert.strictEqual(wh.isTwentyFourHours(1), true);
      assert.deepStrictEqual(wh.getOpeningPeriods(2), []);
    });

    it('should throw if not exactly 7 days', () => {
      const days = createValidWeek().slice(0, 6);
      assert.throws(() => new WorkingHours(days));
    });

    it('should throw if duplicate days', () => {
      const days = createValidWeek();
      days[1] = days[0]; // Duplicate Sunday
      assert.throws(() => new WorkingHours(days));
    });
  });
});
