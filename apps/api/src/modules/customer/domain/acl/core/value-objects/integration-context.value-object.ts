import { ValueObject } from '@saas/core';
import { ACLCorrelationId } from './acl-correlation-id.value-object';
import { ContractMetadata } from './contract-metadata.value-object';

export interface IntegrationContextProps {
  correlationId: ACLCorrelationId;
  metadata: ContractMetadata;
  payload: any;
}

export class IntegrationContext extends ValueObject<IntegrationContextProps> {
  get correlationId(): ACLCorrelationId { return this.props.correlationId; }
  get metadata(): ContractMetadata { return this.props.metadata; }
  get payload(): any { return this.props.payload; }
  private constructor(props: IntegrationContextProps) { super(props); }
  public static create(props: IntegrationContextProps): IntegrationContext {
    return new IntegrationContext(props);
  }
}