import { AggregateRoot } from '@saas/core';
import { LoyaltyAccountId } from '../value-objects/loyalty-account-id.value-object';
import { LoyaltyNumber } from '../value-objects/loyalty-number.value-object';
import { CustomerReference } from '../value-objects/customer-reference.value-object';
import { LoyaltyTierVo } from '../value-objects/loyalty-tier.value-object';
import { LoyaltyStatusVo } from '../value-objects/loyalty-status.value-object';
import { PointsBalance } from '../value-objects/points-balance.value-object';
import { LoyaltyVersion } from '../value-objects/loyalty-version.value-object';
import { LoyaltyTransaction } from '../entities/loyalty-transaction.entity';
import { LoyaltyTierHistory } from '../entities/loyalty-tier-history.entity';
import { LoyaltyReward } from '../entities/loyalty-reward.entity';
import { PointExpiration } from '../entities/point-expiration.entity';
import { LoyaltyAdjustment } from '../entities/loyalty-adjustment.entity';
import { LoyaltyStatus } from '../enums/loyalty.enums';
import { LoyaltyDomainError } from '../errors/loyalty.errors';
import { 
  LoyaltyAccountCreatedEvent,
  PointsEarnedEvent,
  PointsRedeemedEvent
} from '../events/loyalty.events';

export interface LoyaltyAccountProps {
  accountId: LoyaltyAccountId;
  loyaltyNumber: LoyaltyNumber;
  customerRef: CustomerReference;
  tier: LoyaltyTierVo;
  status: LoyaltyStatusVo;
  balance: PointsBalance;
  version: LoyaltyVersion;
  transactions: LoyaltyTransaction[];
  tierHistory: LoyaltyTierHistory[];
  rewards: LoyaltyReward[];
  expirations: PointExpiration[];
  adjustments: LoyaltyAdjustment[];
}

export class LoyaltyAccount extends AggregateRoot<LoyaltyAccountProps> {
  get accountId(): LoyaltyAccountId { return this.props.accountId; }
  get loyaltyNumber(): LoyaltyNumber { return this.props.loyaltyNumber; }
  get customerRef(): CustomerReference { return this.props.customerRef; }
  get tier(): LoyaltyTierVo { return this.props.tier; }
  get status(): LoyaltyStatusVo { return this.props.status; }
  get balance(): PointsBalance { return this.props.balance; }
  get transactions(): LoyaltyTransaction[] { return this.props.transactions; }

  private constructor(props: LoyaltyAccountProps) {
    super(props.accountId.value, props);
  }

  public static create(props: LoyaltyAccountProps): LoyaltyAccount {
    if (!props.customerRef) throw new LoyaltyDomainError('CustomerReference is mandatory');
    const account = new LoyaltyAccount(props);
    account.addDomainEvent(new LoyaltyAccountCreatedEvent(account.id, props.customerRef.customerId));
    return account;
  }

  public addTransaction(transaction: LoyaltyTransaction): void {
    if (this.status.status === LoyaltyStatus.ARCHIVED) {
      throw new LoyaltyDomainError('Archived accounts cannot receive transactions');
    }
    
    if (this.transactions.some(t => t.reference.ref === transaction.reference.ref)) {
      throw new LoyaltyDomainError('Duplicate transaction references prohibited');
    }

    this.props.transactions.push(transaction);

    // Recalculate balance
    const currentBalance = this.balance.amount;
    const newBalance = currentBalance + transaction.amount.value;

    if (newBalance < 0) {
      throw new LoyaltyDomainError('Ledger balance cannot become negative');
    }

    this.props.balance = PointsBalance.create(newBalance);

    if (transaction.amount.value > 0) {
      this.addDomainEvent(new PointsEarnedEvent(this.id, transaction.amount.value));
    } else {
      this.addDomainEvent(new PointsRedeemedEvent(this.id, Math.abs(transaction.amount.value)));
    }
  }
}