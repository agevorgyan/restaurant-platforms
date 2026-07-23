import { ValueObject } from '@saas/core';

export interface LoyaltyAccountIdProps { value: string; }

export class LoyaltyAccountId extends ValueObject<LoyaltyAccountIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: LoyaltyAccountIdProps) { super(props); }
  public static create(value?: string): LoyaltyAccountId {
    return new LoyaltyAccountId({ value: value || crypto.randomUUID() });
  }
}