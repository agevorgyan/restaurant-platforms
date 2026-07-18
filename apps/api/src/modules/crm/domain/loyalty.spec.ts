import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { LoyaltyBalance } from './value-objects/loyalty-balance.value-object';
import { LoyaltyPoints } from './value-objects/loyalty-points.value-object';
import { LoyaltyTier } from './value-objects/loyalty-tier.value-object';
import { LoyaltyTransactionType } from './value-objects/loyalty-transaction-type.value-object';
import { LoyaltyExpirationPolicy } from './value-objects/loyalty-expiration-policy.value-object';
import { validateCreateLoyaltyAccount, validateLoyaltyTransaction } from '../application/validation/loyalty.schema';
import { LoyaltyDomainService } from './services/loyalty.domain.service';
import { ILoyaltyAccountRepository } from './repositories/loyalty-account.repository.interface';
import { ILoyaltyAccount } from './entities/loyalty-account.interface';

describe('Loyalty Domain', () => {
  describe('Value Objects', () => {
    it('LoyaltyBalance should enforce rules', () => {
      assert.doesNotThrow(() => new LoyaltyBalance(0));
      assert.doesNotThrow(() => new LoyaltyBalance(10));
      assert.throws(() => new LoyaltyBalance(-5));
      assert.throws(() => new LoyaltyBalance(1.5));
      
      const b = new LoyaltyBalance(10);
      assert.strictEqual(b.add(5).value, 15);
      assert.strictEqual(b.subtract(5).value, 5);
      assert.throws(() => b.subtract(15));
    });

    it('LoyaltyPoints should enforce rules', () => {
      assert.doesNotThrow(() => new LoyaltyPoints(10));
      assert.throws(() => new LoyaltyPoints(0));
      assert.throws(() => new LoyaltyPoints(-5));
    });

    it('LoyaltyTier should validate', () => {
      assert.doesNotThrow(() => new LoyaltyTier('Gold'));
      assert.throws(() => new LoyaltyTier('Diamond' as any));
    });

    it('LoyaltyTransactionType should validate', () => {
      assert.doesNotThrow(() => new LoyaltyTransactionType('Earn'));
      assert.throws(() => new LoyaltyTransactionType('Buy' as any));
    });

    it('LoyaltyExpirationPolicy should validate', () => {
      assert.doesNotThrow(() => new LoyaltyExpirationPolicy('Never'));
      assert.throws(() => new LoyaltyExpirationPolicy('RollingDays', '10' as any));
      assert.doesNotThrow(() => new LoyaltyExpirationPolicy('RollingDays', 30));
    });
  });

  describe('Validation', () => {
    it('should validate creation', () => {
      const err = validateCreateLoyaltyAccount({} as any);
      assert.strictEqual(err.length, 3);
    });

    it('should validate transactions', () => {
      const err = validateLoyaltyTransaction({ reason: '', points: 0 });
      assert.strictEqual(err.length, 2);
    });
  });

  describe('Domain Service', () => {
    const mockAccounts: ILoyaltyAccount[] = [];
    const mockRepo: ILoyaltyAccountRepository = {
      findById: async (id) => mockAccounts.find(a => a.id === id) || null,
      findByCustomerId: async (rid, cid) => mockAccounts.find(a => a.restaurantId === rid && a.customerId === cid) || null,
      findByAccountNumber: async (rid, an) => mockAccounts.find(a => a.restaurantId === rid && a.accountNumber === an) || null,
      save: async (a) => {
        const i = mockAccounts.findIndex(ma => ma.id === a.id);
        if (i >= 0) mockAccounts[i] = a;
        else mockAccounts.push(a);
      }
    };

    const service = new LoyaltyDomainService(mockRepo);

    it('should enforce single account and unique number', async () => {
      mockAccounts.push({
        id: 'acc1',
        restaurantId: 'r1',
        customerId: 'cust1',
        accountNumber: 'NUM1',
        balance: new LoyaltyBalance(0),
        tier: new LoyaltyTier('Bronze')
      } as any);

      try {
        await service.createAccount('acc2', { restaurantId: 'r1', customerId: 'cust1', accountNumber: 'NUM2' });
        assert.fail('Should throw customer limit');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Each customer may have only one loyalty account');
      }

      try {
        await service.createAccount('acc3', { restaurantId: 'r1', customerId: 'cust2', accountNumber: 'NUM1' });
        assert.fail('Should throw account number limit');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Account number must be unique within the restaurant');
      }
    });

    it('should earn and redeem points', async () => {
      const acc = await service.createAccount('acc4', { restaurantId: 'r1', customerId: 'cust4', accountNumber: 'NUM4' });
      assert.strictEqual(acc.balance.value, 0);

      const earned = await service.earnPoints('acc4', { reason: 'Order', points: 50, referenceType: 'Order', referenceId: 'ord1' });
      assert.strictEqual(earned.balance.value, 50);
      assert.strictEqual(earned.transactions.length, 1);

      const redeemed = await service.redeemPoints('acc4', { reason: 'Discount', points: 30 });
      assert.strictEqual(redeemed.balance.value, 20);

      try {
        await service.redeemPoints('acc4', { reason: 'Too much', points: 50 });
        assert.fail('Should throw insufficient');
      } catch(e: any) {
        assert.strictEqual(e.message, 'Insufficient balance');
      }
    });

    it('should change tier', async () => {
      const acc = await service.changeTier('acc4', 'Gold');
      assert.strictEqual(acc.tier.value, 'Gold');
      assert.ok(acc.domainEvents?.some(e => e.eventName === 'LoyaltyTierChanged'));
    });
  });
});
