import { ValueObject } from '@saas/core';

export interface ExternalCustomerReferenceProps { externalId: string; source: string; }

export class ExternalCustomerReference extends ValueObject<ExternalCustomerReferenceProps> {
  get externalId(): string { return this.props.externalId; }
  get source(): string { return this.props.source; }
  private constructor(props: ExternalCustomerReferenceProps) { super(props); }
  public static create(props: ExternalCustomerReferenceProps): ExternalCustomerReference {
    return new ExternalCustomerReference(props);
  }
}