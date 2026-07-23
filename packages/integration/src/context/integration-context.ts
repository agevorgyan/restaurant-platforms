import { CorrelationId, CausationId, IdempotencyKey } from '../value-objects/value-objects';

export interface ContractMetadata {
  readonly version: string;
  readonly timestamp: Date;
  readonly sourceContext: string;
  readonly eventType: string;
}

export interface IntegrationContext {
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly idempotencyKey?: IdempotencyKey;
  readonly metadata: ContractMetadata;
}
