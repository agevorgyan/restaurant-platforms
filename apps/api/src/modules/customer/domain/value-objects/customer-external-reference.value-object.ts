import { ValueObject } from '@saas/core';

export interface CustomerExternalReferenceProps { provider: string; externalId: string; }

export class CustomerExternalReference extends ValueObject<CustomerExternalReferenceProps> {
  get provider(): string { return this.props.provider; }
  get externalId(): string { return this.props.externalId; }
  private constructor(props: CustomerExternalReferenceProps) { super(props); }
  public static create(provider: string, externalId: string): CustomerExternalReference {
    return new CustomerExternalReference({ provider, externalId });
  }
}