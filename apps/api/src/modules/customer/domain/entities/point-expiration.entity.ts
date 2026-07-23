import { Entity } from '@saas/core';
import { PointsAmount } from '../value-objects/points-amount.value-object';
import { PointsExpirationDate } from '../value-objects/points-expiration-date.value-object';
import { TransactionReference } from '../value-objects/transaction-reference.value-object';

export interface PointExpirationProps {
  amount: PointsAmount;
  expirationDate: PointsExpirationDate;
  sourceTransactionRef: TransactionReference;
  isExpired: boolean;
}

export class PointExpiration extends Entity<PointExpirationProps> {
  private constructor(id: string, props: PointExpirationProps) { super(id, props); }
  public static create(id: string, props: PointExpirationProps): PointExpiration {
    return new PointExpiration(id, props);
  }
}