import { ValueObject } from '@saas/core';

export interface TierReferenceProps { tierId: string; }

export class TierReference extends ValueObject<TierReferenceProps> {
  get tierId(): string { return this.props.tierId; }
  private constructor(props: TierReferenceProps) { super(props); }
  public static create(tierId: string): TierReference {
    return new TierReference({ tierId });
  }
}