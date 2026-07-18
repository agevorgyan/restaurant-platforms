import { describe, it, beforeEach } from 'node:test';
import * as assert from 'node:assert';
import { MembershipStatus } from './value-objects/membership-status.value-object';
import { MembershipPeriod } from './value-objects/membership-period.value-object';
import { RewardType } from './value-objects/reward-type.value-object';
import { RewardValidityPeriod } from './value-objects/reward-validity-period.value-object';
import { MembershipDomainService } from './services/membership.domain.service';
import { RewardPolicyDomainService } from './services/reward-policy.domain.service';
import { IMembershipProgramRepository } from './repositories/membership-program.repository.interface';
import { IRewardPolicyRepository } from './repositories/reward-policy.repository.interface';
import { IMembershipProgram } from './entities/membership-program.interface';
import { IRewardPolicy } from './entities/reward-policy.interface';
import { validateCreateMembershipProgram, validateMembershipTier } from '../application/validation/membership-reward.schema';

describe('Membership & Reward Domain', () => {
  describe('Value Objects', () => {
    it('MembershipStatus should validate', () => {
      assert.doesNotThrow(() => new MembershipStatus('Draft'));
      assert.throws(() => new MembershipStatus('Invalid' as any));
    });

    it('MembershipPeriod should validate logic', () => {
      const today = new Date();
      const past = new Date(today.getTime() - 100000);
      const future = new Date(today.getTime() + 100000);

      assert.throws(() => new MembershipPeriod(future, past));
      const period = new MembershipPeriod(past, future);
      assert.ok(period.isEffective(today));
    });

    it('RewardType should validate', () => {
      assert.doesNotThrow(() => new RewardType('Points'));
      assert.throws(() => new RewardType('Cash' as any));
    });

    it('RewardValidityPeriod should check overlaps', () => {
      const p1 = new RewardValidityPeriod(new Date('2026-01-01'), new Date('2026-01-31'));
      const p2 = new RewardValidityPeriod(new Date('2026-01-15'), new Date('2026-02-15'));
      const p3 = new RewardValidityPeriod(new Date('2026-02-01'), new Date('2026-02-28'));

      assert.ok(p1.overlaps(p2));
      assert.ok(!p1.overlaps(p3));
    });
  });

  describe('Validation', () => {
    it('should validate create payloads', () => {
      const err = validateCreateMembershipProgram({ restaurantId: '', name: '', effectiveStartDate: new Date() });
      assert.strictEqual(err.length, 2);

      const err2 = validateMembershipTier({ name: '', minimumPoints: -1, priority: -1, benefits: [] });
      assert.strictEqual(err2.length, 3);
    });
  });

  describe('MembershipDomainService', () => {
    let mockPrograms: IMembershipProgram[] = [];
    const mockRepo: IMembershipProgramRepository = {
      findById: async (id) => mockPrograms.find(p => p.id === id) || null,
      findActiveByRestaurantId: async (rid) => mockPrograms.find(p => p.restaurantId === rid && p.status.isActive()) || null,
      save: async (p) => {
        const i = mockPrograms.findIndex(mp => mp.id === p.id);
        if (i >= 0) mockPrograms[i] = p;
        else mockPrograms.push(p);
      }
    };
    const service = new MembershipDomainService(mockRepo);

    beforeEach(() => {
      mockPrograms = [];
    });

    it('should enforce unique active program per restaurant', async () => {
      await service.createProgram('p1', { restaurantId: 'r1', name: 'P1', effectiveStartDate: new Date() });
      await service.activateProgram('p1');

      await service.createProgram('p2', { restaurantId: 'r1', name: 'P2', effectiveStartDate: new Date() });
      try {
        await service.activateProgram('p2');
        assert.fail('Should throw');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Only one active membership program is allowed per restaurant');
      }
    });

    it('should enforce tier priority and points rules', async () => {
      await service.createProgram('p1', { restaurantId: 'r1', name: 'P1', effectiveStartDate: new Date() });
      await service.addTier('p1', { name: 'Silver', minimumPoints: 100, priority: 1, benefits: [] });

      try {
        await service.addTier('p1', { name: 'Gold', minimumPoints: 50, priority: 2, benefits: [] });
        assert.fail('Should throw points decrease');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Minimum points must increase with tier priority');
      }

      try {
        await service.addTier('p1', { name: 'Gold', minimumPoints: 200, priority: 1, benefits: [] });
        assert.fail('Should throw duplicate priority');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Tier priorities must be unique');
      }
    });
  });

  describe('RewardPolicyDomainService', () => {
    let mockPolicies: IRewardPolicy[] = [];
    const mockRepo: IRewardPolicyRepository = {
      findById: async (id) => mockPolicies.find(p => p.id === id) || null,
      findByRestaurantId: async (rid) => mockPolicies.filter(p => p.restaurantId === rid),
      save: async (p) => {
        const i = mockPolicies.findIndex(mp => mp.id === p.id);
        if (i >= 0) mockPolicies[i] = p;
        else mockPolicies.push(p);
      }
    };
    const service = new RewardPolicyDomainService(mockRepo);

    beforeEach(() => {
      mockPolicies = [];
    });

    it('should enforce non-overlapping validity periods for active policies', async () => {
      const t1 = new Date('2026-01-01');
      const t2 = new Date('2026-01-31');
      const t3 = new Date('2026-01-15');
      const t4 = new Date('2026-02-15');

      await service.createPolicy('rp1', { restaurantId: 'r1', name: 'RP1', validStartDate: t1, validEndDate: t2 });
      await service.publishPolicy('rp1');

      try {
        await service.createPolicy('rp2', { restaurantId: 'r1', name: 'RP2', validStartDate: t3, validEndDate: t4 });
        assert.fail('Should throw overlap');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Reward policies may not have overlapping validity periods');
      }
    });

    it('should enforce rule immutability after publish', async () => {
      const t1 = new Date('2026-01-01');
      const t2 = new Date('2026-01-31');
      await service.createPolicy('rp3', { restaurantId: 'r1', name: 'RP3', validStartDate: t1, validEndDate: t2 });
      await service.addRule('rp3', { rewardType: 'Points', triggerType: 'Order', rewardValue: 10, conditions: {} });
      await service.publishPolicy('rp3');

      try {
        await service.addRule('rp3', { rewardType: 'Points', triggerType: 'Order', rewardValue: 20, conditions: {} });
        assert.fail('Should throw immutable');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Reward rules are immutable once a policy is published');
      }
    });
  });
});
