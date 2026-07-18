import { LoyaltyTier } from '../value-objects/loyalty-tier.value-object';
import { LoyaltyBalance } from '../value-objects/loyalty-balance.value-object';
import { LoyaltyExpirationPolicy } from '../value-objects/loyalty-expiration-policy.value-object';
import { ILoyaltyTransaction } from './loyalty-transaction.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ILoyaltyAccount {
  id: string;
  restaurantId: string;
  customerId: string;
  accountNumber: string;
  tier: LoyaltyTier;
  balance: LoyaltyBalance;
  expirationPolicy: LoyaltyExpirationPolicy;
  transactions: ILoyaltyTransaction[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
