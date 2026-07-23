import { LoyaltyAccount } from '../aggregates/loyalty-account.aggregate';
import { LoyaltyAccountId } from '../value-objects/loyalty-account-id.value-object';
import { LoyaltyNumber } from '../value-objects/loyalty-number.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { LoyaltyTierVo } from '../value-objects/loyalty-tier.value-object';
import { LoyaltyStatusVo } from '../value-objects/loyalty-status.value-object';
import { PointsBalance } from '../value-objects/points-balance.value-object';
import { LoyaltyVersion } from '../value-objects/loyalty-version.value-object';
import { LoyaltyStatus, LoyaltyTier, TransactionType } from '../enums/loyalty.enums';
import { LoyaltyTransaction } from '../entities/loyalty-transaction.entity';
import { PointsAmount } from '../value-objects/points-amount.value-object';
import { PointsReason } from '../value-objects/points-reason.value-object';
import { TransactionReference } from '../value-objects/transaction-reference.value-object';

describe('LoyaltyAccount Aggregate', () => {
  const createValidProps = () => ({
    accountId: LoyaltyAccountId.create('L1'),
    loyaltyNumber: LoyaltyNumber.create('LN123'),
    customerRef: CustomerReference.create('C1'),
    tier: LoyaltyTierVo.create(LoyaltyTier.BASIC),
    status: LoyaltyStatusVo.create(LoyaltyStatus.ACTIVE),
    balance: PointsBalance.create(100),
    version: LoyaltyVersion.create(1),
    transactions: [],
    tierHistory: [],
    rewards: [],
    expirations: [],
    adjustments: []
  });

  it('should create a loyalty account', () => {
    const account = LoyaltyAccount.create(createValidProps());
    expect(account.id).toBe('L1');
    expect(account.balance.amount).toBe(100);
  });

  it('should process a transaction and update balance', () => {
    const account = LoyaltyAccount.create(createValidProps());
    const tx = LoyaltyTransaction.create('t1', {
      type: TransactionType.EARN,
      amount: PointsAmount.create(50),
      reason: PointsReason.create('Purchase'),
      reference: TransactionReference.create('tx-1'),
      createdAt: new Date()
    });

    account.addTransaction(tx);
    expect(account.balance.amount).toBe(150);
    expect(account.transactions.length).toBe(1);
  });

  it('should prevent duplicate transaction references', () => {
    const account = LoyaltyAccount.create(createValidProps());
    const tx = LoyaltyTransaction.create('t1', {
      type: TransactionType.EARN,
      amount: PointsAmount.create(50),
      reason: PointsReason.create('Purchase'),
      reference: TransactionReference.create('tx-1'),
      createdAt: new Date()
    });

    account.addTransaction(tx);
    expect(() => account.addTransaction(tx)).toThrow(/Duplicate transaction references/);
  });

  it('should prevent balance from going negative', () => {
    const account = LoyaltyAccount.create(createValidProps());
    const tx = LoyaltyTransaction.create('t2', {
      type: TransactionType.REDEEM,
      amount: PointsAmount.create(-150),
      reason: PointsReason.create('Reward'),
      reference: TransactionReference.create('tx-2'),
      createdAt: new Date()
    });

    expect(() => account.addTransaction(tx)).toThrow(/Ledger balance cannot become negative/);
  });
});