export interface ValidationContext {
  readonly target: string;
  readonly timestamp: Date;
  readonly traceId?: string;
}

export interface RuleEvaluationContext {
  readonly correlationId: string;
  readonly parameters: Record<string, unknown>;
  readonly timestamp: Date;
}
