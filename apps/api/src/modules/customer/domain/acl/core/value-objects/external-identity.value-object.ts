import { ValueObject } from '@saas/core';

export interface ExternalIdentityProps { identityValue: string; provider: string; }

export class ExternalIdentity extends ValueObject<ExternalIdentityProps> {
  get identityValue(): string { return this.props.identityValue; }
  get provider(): string { return this.props.provider; }
  private constructor(props: ExternalIdentityProps) { super(props); }
  public static create(props: ExternalIdentityProps): ExternalIdentity {
    return new ExternalIdentity(props);
  }
}