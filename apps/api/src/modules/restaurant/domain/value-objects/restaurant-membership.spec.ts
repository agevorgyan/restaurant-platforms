import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { MembershipRole } from './membership-role.value-object';
import { MembershipStatus } from './membership-status.value-object';

describe('Restaurant Membership Domain', () => {
  describe('MembershipRole', () => {
    it('should create valid roles', () => {
      const owner = new MembershipRole('Owner');
      const waiter = new MembershipRole('Waiter');
      
      assert.strictEqual(owner.value, 'Owner');
      assert.strictEqual(waiter.value, 'Waiter');
      assert.strictEqual(owner.isOwner(), true);
      assert.strictEqual(waiter.isOwner(), false);
    });

    it('should throw on invalid role', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new MembershipRole('InvalidRole'));
    });
  });

  describe('MembershipStatus', () => {
    it('should create valid statuses', () => {
      const active = new MembershipStatus('Active');
      const pending = new MembershipStatus('Pending');
      
      assert.strictEqual(active.value, 'Active');
      assert.strictEqual(pending.value, 'Pending');
    });

    it('should validate transitions', () => {
      const pending = new MembershipStatus('Pending');
      const active = new MembershipStatus('Active');
      const removed = new MembershipStatus('Removed');

      assert.strictEqual(pending.canTransitionTo('Active'), true);
      assert.strictEqual(pending.canTransitionTo('Suspended'), false); // Pending -> Suspended not allowed
      assert.strictEqual(pending.canTransitionTo('Removed'), true);
      assert.strictEqual(removed.canTransitionTo('Active'), false); // Removed is terminal
      assert.strictEqual(active.canTransitionTo('Suspended'), true);
    });

    it('should throw on invalid status', () => {
      // @ts-expect-error Testing invalid cast
      assert.throws(() => new MembershipStatus('InvalidStatus'));
    });
  });
});
