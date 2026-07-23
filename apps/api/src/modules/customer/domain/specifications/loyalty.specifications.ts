import { LoyaltyDomainError } from '../errors/loyalty.errors';

export class LoyaltyAccountConsistencySpecification {
  public static isSatisfiedBy(account: any): boolean {
    if (!account.customerRef) throw new LoyaltyDomainError('CustomerReference missing');
    return true;
  }
}

export class PointsBalanceSpecification {
  public static canRedeem(balance: number, cost: number): boolean {
    return balance >= Math.abs(cost);
  }
}

export class TierSpecification {
  public static isValidTransition(current: string, next: string): boolean {
    void current; void next;
    return true; // Simplified for placeholder
  }
}

export class ExpirationSpecification {
  public static isValid(date: Date): boolean {
    return date.getTime() >= new Date().getTime();
  }
}

export class RewardSpecification {
  public static canGrant(reward: any): boolean {
    void reward;
    return true;
  }
}