export interface DomainContext {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly tenantId: string;
  readonly userId?: string;
  readonly requestId: string;
  readonly traceId?: string;
}
