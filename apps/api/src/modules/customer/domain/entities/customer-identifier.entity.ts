import { Entity } from '@saas/core';
import { CustomerExternalReference } from '../value-objects/customer-external-reference.value-object';

export interface CustomerIdentifierProps {
  externalReference: CustomerExternalReference;
}

export class CustomerIdentifier extends Entity<CustomerIdentifierProps> {
  get externalReference(): CustomerExternalReference { return this.props.externalReference; }
  private constructor(id: string, props: CustomerIdentifierProps) { super(id, props); }
  public static create(id: string, props: CustomerIdentifierProps): CustomerIdentifier {
    return new CustomerIdentifier(id, props);
  }
}