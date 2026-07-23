import { CorrelationId, CausationId, EventVersion } from '../value-objects/value-objects';

export interface EventMetadata {
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly timestamp: Date;
  readonly version: EventVersion;
}
