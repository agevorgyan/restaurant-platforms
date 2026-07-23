import { ValueObject } from '@saas/core';

export interface LoyaltyNumberProps { value: string; }

export class LoyaltyNumber extends ValueObject<LoyaltyNumberProps> {
  get value(): string { return this.props.value; }
  private constructor(props: LoyaltyNumberProps) { super(props); }
  public static create(value: string): LoyaltyNumber {
    if (!value) throw new Error('LoyaltyNumber cannot be empty');
    return new LoyaltyNumber({ value });
  }
}