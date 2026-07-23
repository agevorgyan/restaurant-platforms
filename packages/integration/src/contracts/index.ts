import { ContractEnvelope } from '../envelope';
import { ContractMetadata } from '../metadata';
import { ProducerIdentifier, ConsumerIdentifier, ContractVersion, ContractName, ContractIdentifier } from '../types';

export class BaseContract<TPayload> implements ContractEnvelope<TPayload> {
  constructor(
    public readonly contractId: ContractIdentifier,
    public readonly contractName: ContractName,
    public readonly contractVersion: ContractVersion,
    public readonly payload: TPayload,
    public readonly metadata: ContractMetadata,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly occurredAt: Date,
    public readonly producer: ProducerIdentifier,
    public readonly consumer: ConsumerIdentifier
  ) {}
}
