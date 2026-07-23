import { ValueObject } from '@saas/core';

export interface ConsentReferenceProps { consentId: string; }

export class ConsentReference extends ValueObject<ConsentReferenceProps> {
  get consentId(): string { return this.props.consentId; }
  private constructor(props: ConsentReferenceProps) { super(props); }
  public static create(consentId: string): ConsentReference {
    return new ConsentReference({ consentId });
  }
}