export interface PolicyContext {
  readonly timestamp: Date;
  readonly metadata: Record<string, unknown>;
}
