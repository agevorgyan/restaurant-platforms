export interface PolicyViolation {
  readonly code: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}
