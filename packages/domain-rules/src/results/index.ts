export interface PolicyResult {
  readonly success: boolean;
  readonly failures: string[];
  readonly warnings: string[];
  readonly messages: string[];
}

export interface RuleEvaluationResult {
  readonly passed: boolean;
  readonly message?: string;
  readonly metadata?: Record<string, unknown>;
}
