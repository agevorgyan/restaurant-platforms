export class LoyaltyLifecyclePolicy {
  public static enforce(account: any): void {
    void account;
  }
}

export class PointsPolicy {
  public static validate(transaction: any): void {
    void transaction;
  }
}

export class TierPolicy {
  public static validate(history: any): void {
    void history;
  }
}

export class RewardPolicy {
  public static validate(reward: any): void {
    void reward;
  }
}

export class ExpirationPolicy {
  public static validate(expiration: any): void {
    void expiration;
  }
}