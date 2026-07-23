import { ProducerIdentifier, ConsumerIdentifier, ContractVersion } from '../types';

export interface ContractMetadata {
  readonly producer: ProducerIdentifier;
  readonly consumer: ConsumerIdentifier;
  readonly sourceBc: string;
  readonly destinationBc: string;
  readonly schemaVersion: ContractVersion;
  readonly createdAt: Date;
  readonly traceId: string;
  readonly requestId: string;
}
