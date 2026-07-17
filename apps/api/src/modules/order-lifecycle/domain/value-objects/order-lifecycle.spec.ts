import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { OrderState } from './order-state.value-object';
import { OrderStateMachine } from '../services/order-state-machine.service';

describe('Order Lifecycle Domain', () => {
  describe('OrderState', () => {
    it('should validate status boundaries natively', () => {
      assert.doesNotThrow(() => new OrderState('Draft'));
      assert.doesNotThrow(() => new OrderState('Refunded'));
      assert.throws(() => new OrderState('InvalidState' as any), /Invalid Order State: InvalidState/);
    });

    it('should identify terminal states correctly', () => {
      assert.strictEqual(new OrderState('Refunded').isTerminal(), true);
      assert.strictEqual(new OrderState('Completed').isTerminal(), false);
    });

    it('should evaluate equality strictly', () => {
      const state1 = new OrderState('Pending');
      const state2 = new OrderState('Pending');
      const state3 = new OrderState('Draft');

      assert.strictEqual(state1.equals(state2), true);
      assert.strictEqual(state1.equals(state3), false);
    });
  });

  describe('OrderStateMachine', () => {
    const stateMachine = new OrderStateMachine();

    it('should allow valid transitions', () => {
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Draft'), new OrderState('Pending')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Pending'), new OrderState('Confirmed')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Confirmed'), new OrderState('Preparing')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Preparing'), new OrderState('Ready')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Ready'), new OrderState('Completed')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Completed'), new OrderState('Refunded')));
      assert.doesNotThrow(() => stateMachine.transition(new OrderState('Draft'), new OrderState('Cancelled')));
    });

    it('should reject completed orders returning to previous states', () => {
      assert.throws(() => stateMachine.transition(new OrderState('Completed'), new OrderState('Preparing')), /Illegal state transition/);
      assert.throws(() => stateMachine.transition(new OrderState('Completed'), new OrderState('Draft')), /Illegal state transition/);
    });

    it('should enforce terminal bounds on refunded orders', () => {
      assert.throws(() => stateMachine.transition(new OrderState('Refunded'), new OrderState('Completed')), /Illegal state transition/);
      assert.throws(() => stateMachine.transition(new OrderState('Refunded'), new OrderState('Draft')), /Illegal state transition/);
    });

    it('should prevent cancelled orders from entering active pipeline states', () => {
      // Cancelled can only go to Refunded, not Preparing
      assert.throws(() => stateMachine.transition(new OrderState('Cancelled'), new OrderState('Preparing')), /Illegal state transition/);
      assert.throws(() => stateMachine.transition(new OrderState('Cancelled'), new OrderState('Confirmed')), /Illegal state transition/);
    });
  });
});
