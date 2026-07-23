import { ContractMetadata } from '../metadata';
import { ProducerIdentifier, ConsumerIdentifier, ContractVersion, ContractName, ContractIdentifier } from '../types';

export interface ContractEnvelope<TPayload> {
  readonly contractId: ContractIdentifier;
  readonly contractName: ContractName;
  readonly contractVersion: ContractVersion;
  readonly payload: TPayload;
  readonly metadata: ContractMetadata;
  readonly correlationId: string;
  readonly causationId: string;
  readonly occurredAt: Date;
  readonly producer: ProducerIdentifier;
  readonly consumer: ConsumerIdentifier;
}
