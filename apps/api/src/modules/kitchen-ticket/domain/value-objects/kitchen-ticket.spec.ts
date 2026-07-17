import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { KitchenTicketStatus } from './kitchen-ticket-status.value-object';
import { KitchenTicketPriority } from './kitchen-ticket-priority.value-object';
import { PreparationTime } from './preparation-time.value-object';

describe('Kitchen Ticket Domain', () => {
  describe('KitchenTicketStatus', () => {
    it('should create valid statuses', () => {
      assert.doesNotThrow(() => new KitchenTicketStatus('Pending'));
      assert.doesNotThrow(() => new KitchenTicketStatus('Queued'));
      assert.doesNotThrow(() => new KitchenTicketStatus('Preparing'));
      assert.doesNotThrow(() => new KitchenTicketStatus('Ready'));
      assert.doesNotThrow(() => new KitchenTicketStatus('Completed'));
      assert.doesNotThrow(() => new KitchenTicketStatus('Cancelled'));
    });

    it('should throw on invalid status', () => {
      assert.throws(() => new KitchenTicketStatus('Invalid' as any), /Invalid ticket status/);
    });

    it('should correctly determine terminal states', () => {
      assert.strictEqual(new KitchenTicketStatus('Completed').isTerminal(), true);
      assert.strictEqual(new KitchenTicketStatus('Cancelled').isTerminal(), true);
      assert.strictEqual(new KitchenTicketStatus('Ready').isTerminal(), false);
    });

    it('should block transitions from terminal states', () => {
      assert.strictEqual(new KitchenTicketStatus('Completed').canTransitionTo('Pending'), false);
      assert.strictEqual(new KitchenTicketStatus('Cancelled').canTransitionTo('Preparing'), false);
    });

    it('should block Cancelled to Ready explicitly', () => {
      assert.strictEqual(new KitchenTicketStatus('Cancelled').canTransitionTo('Ready'), false);
    });
  });

  describe('PreparationTime', () => {
    it('should create valid preparation time', () => {
      assert.doesNotThrow(() => new PreparationTime(15));
      assert.doesNotThrow(() => new PreparationTime(1));
    });

    it('should throw if time is zero or negative', () => {
      assert.throws(() => new PreparationTime(0), /Preparation time must be greater than zero/);
      assert.throws(() => new PreparationTime(-10), /Preparation time must be greater than zero/);
    });

    it('should throw if time is not an integer', () => {
      assert.throws(() => new PreparationTime(10.5), /Preparation time must be an integer/);
    });
  });

  describe('KitchenTicketPriority', () => {
    it('should create valid ticket priority', () => {
      assert.doesNotThrow(() => new KitchenTicketPriority('Low'));
      assert.doesNotThrow(() => new KitchenTicketPriority('Rush'));
    });

    it('should throw on invalid ticket priority', () => {
      assert.throws(() => new KitchenTicketPriority('Invalid' as any), /Invalid ticket priority/);
    });
  });
});
