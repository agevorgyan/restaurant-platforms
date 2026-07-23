export interface RepositoryContext {
  readonly transactionId?: string;
  readonly correlationId?: string;
  readonly metadata?: Record<string, unknown>;
}
