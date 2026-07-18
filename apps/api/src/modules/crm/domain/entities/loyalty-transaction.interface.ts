import { LoyaltyTransactionType } from '../value-objects/loyalty-transaction-type.value-object';
import { LoyaltyTransactionReason } from '../value-objects/loyalty-transaction-reason.value-object';
import { LoyaltyPoints } from '../value-objects/loyalty-points.value-object';

export interface ILoyaltyTransaction {
  id: string;
  transactionType: LoyaltyTransactionType;
  reason: LoyaltyTransactionReason;
  points: LoyaltyPoints;
  referenceType?: string;
  referenceId?: string;
  occurredAt: Date;
  expiresAt?: Date;
}
