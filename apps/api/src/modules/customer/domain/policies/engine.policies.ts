export class PointsCalculationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class TierEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class RewardEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class ExpirationEvaluationPolicy {
  public static enforce(context: any): void {
    void context;
  }
}

export class RuleExecutionPolicy {
  public static enforce(context: any): void {
    if (!context) throw new Error('Evaluation context cannot be null');
  }
}