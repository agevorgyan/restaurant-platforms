import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { CategoryStatus } from './category-status.value-object';
import { CategoryVisibility } from './category-visibility.value-object';

describe('Category Domain Value Objects', () => {
  describe('CategoryStatus', () => {
    it('should create valid statuses', () => {
      const active = new CategoryStatus('Active');
      const archived = new CategoryStatus('Archived');
      
      assert.strictEqual(active.value, 'Active');
      assert.strictEqual(archived.value, 'Archived');
      assert.strictEqual(archived.isArchived(), true);
      assert.strictEqual(active.isArchived(), false);
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new CategoryStatus('InvalidStatus'));
    });
  });

  describe('CategoryVisibility', () => {
    it('should create valid visibility', () => {
      const publicVis = new CategoryVisibility('Public');
      const hiddenVis = new CategoryVisibility('Hidden');
      
      assert.strictEqual(publicVis.value, 'Public');
      assert.strictEqual(hiddenVis.value, 'Hidden');
    });

    it('should throw on invalid visibility', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new CategoryVisibility('InvalidVis'));
    });
  });
});
