import { ValueObject } from '@saas/core';

export interface ContractMetadataProps {
  sourceContext: string;
  timestamp: Date;
  eventId: string;
}

export class ContractMetadata extends ValueObject<ContractMetadataProps> {
  get sourceContext(): string { return this.props.sourceContext; }
  get timestamp(): Date { return this.props.timestamp; }
  get eventId(): string { return this.props.eventId; }
  private constructor(props: ContractMetadataProps) { super(props); }
  public static create(props: ContractMetadataProps): ContractMetadata {
    return new ContractMetadata(props);
  }
}