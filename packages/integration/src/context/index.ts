import { ProducerIdentifier, ConsumerIdentifier, ContractVersion } from '../types';

export interface IntegrationContext {
  readonly correlationId: string;
  readonly causationId: string;
  readonly traceId: string;
  readonly requestId: string;
  readonly producer: ProducerIdentifier;
  readonly consumer: ConsumerIdentifier;
  readonly contractVersion: ContractVersion;
  readonly timestamp: Date;
}
