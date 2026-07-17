import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { KitchenStatus } from './kitchen-status.value-object';
import { KitchenPriorityMode } from './kitchen-priority.value-object';

describe('Kitchen Domain', () => {
  describe('KitchenStatus', () => {
    it('should create valid statuses', () => {
      assert.doesNotThrow(() => new KitchenStatus('Open'));
      assert.doesNotThrow(() => new KitchenStatus('Closed'));
      assert.doesNotThrow(() => new KitchenStatus('Paused'));
      assert.doesNotThrow(() => new KitchenStatus('Maintenance'));
    });

    it('should throw on invalid status', () => {
      assert.throws(() => new KitchenStatus('Invalid' as any), /Invalid kitchen status/);
    });

    it('should correctly determine if it can receive tickets', () => {
      assert.strictEqual(new KitchenStatus('Open').canReceiveTickets(), true);
      assert.strictEqual(new KitchenStatus('Closed').canReceiveTickets(), false);
      assert.strictEqual(new KitchenStatus('Paused').canReceiveTickets(), false);
    });

    it('should correctly determine if it can keep existing tickets', () => {
      assert.strictEqual(new KitchenStatus('Open').canKeepExistingTickets(), true);
      assert.strictEqual(new KitchenStatus('Paused').canKeepExistingTickets(), true);
      assert.strictEqual(new KitchenStatus('Closed').canKeepExistingTickets(), false);
    });
  });

  describe('KitchenPriorityMode', () => {
    it('should create valid priority modes', () => {
      assert.doesNotThrow(() => new KitchenPriorityMode('FIFO'));
      assert.doesNotThrow(() => new KitchenPriorityMode('Priority'));
      assert.doesNotThrow(() => new KitchenPriorityMode('Hybrid'));
    });

    it('should throw on invalid priority mode', () => {
      assert.throws(() => new KitchenPriorityMode('Random' as any), /Invalid priority mode/);
    });
  });
});
