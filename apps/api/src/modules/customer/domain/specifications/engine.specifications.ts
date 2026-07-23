export class PointsCalculationSpecification {
  public static isEligible(context: any): boolean {
    void context;
    return true;
  }
}

export class TierUpgradeSpecification {
  public static canUpgrade(context: any): boolean {
    void context;
    return true;
  }
}

export class RewardEligibilitySpecification {
  public static isEligible(context: any): boolean {
    void context;
    return true;
  }
}

export class PointExpirationSpecification {
  public static hasExpiredPoints(context: any): boolean {
    void context;
    return false;
  }
}

export class RuleConsistencySpecification {
  public static isConsistent(context: any): boolean {
    return !!context.customerRef && !!context.loyaltyAccountRef;
  }
}