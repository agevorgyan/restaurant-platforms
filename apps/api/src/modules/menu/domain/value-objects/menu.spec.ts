import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { MenuStatus } from './menu-status.value-object';
import { MenuVisibility } from './menu-visibility.value-object';

describe('Menu Domain Value Objects', () => {
  describe('MenuStatus', () => {
    it('should create valid statuses', () => {
      const draft = new MenuStatus('Draft');
      const published = new MenuStatus('Published');
      const archived = new MenuStatus('Archived');
      
      assert.strictEqual(draft.value, 'Draft');
      assert.strictEqual(published.value, 'Published');
      assert.strictEqual(archived.value, 'Archived');
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new MenuStatus('InvalidStatus'));
    });

    it('should prevent Archived -> Published transitions directly', () => {
      const archived = new MenuStatus('Archived');
      assert.strictEqual(archived.canTransitionTo('Published'), false);
    });

    it('should allow Draft -> Published transition', () => {
      const draft = new MenuStatus('Draft');
      assert.strictEqual(draft.canTransitionTo('Published'), true);
    });
  });

  describe('MenuVisibility', () => {
    it('should create valid visibility', () => {
      const publicVis = new MenuVisibility('Public');
      const qrVis = new MenuVisibility('QR');
      
      assert.strictEqual(publicVis.value, 'Public');
      assert.strictEqual(qrVis.value, 'QR');
    });

    it('should throw on invalid visibility', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new MenuVisibility('InvalidVis'));
    });
  });
});
