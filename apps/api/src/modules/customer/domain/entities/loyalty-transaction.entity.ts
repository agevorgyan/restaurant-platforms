import { Entity } from '@saas/core';
import { TransactionType } from '../enums/loyalty.enums';
import { PointsAmount } from '../value-objects/points-amount.value-object';
import { PointsReason } from '../value-objects/points-reason.value-object';
import { TransactionReference } from '../value-objects/transaction-reference.value-object';
import { OrderReference } from '../value-objects/order-reference.value-object';

export interface LoyaltyTransactionProps {
  type: TransactionType;
  amount: PointsAmount;
  reason: PointsReason;
  reference: TransactionReference;
  orderRef?: OrderReference;
  createdAt: Date;
}

export class LoyaltyTransaction extends Entity<LoyaltyTransactionProps> {
  get type(): TransactionType { return this.props.type; }
  get amount(): PointsAmount { return this.props.amount; }
  get reference(): TransactionReference { return this.props.reference; }
  private constructor(id: string, props: LoyaltyTransactionProps) { super(id, props); }
  public static create(id: string, props: LoyaltyTransactionProps): LoyaltyTransaction {
    return new LoyaltyTransaction(id, props);
  }
}