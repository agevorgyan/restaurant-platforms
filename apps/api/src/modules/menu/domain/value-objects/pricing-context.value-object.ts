import { ValueObject } from '@saas/core';

export interface PricingContextProps {
  channelId: string;
  branchId: string;
}

export class PricingContext extends ValueObject<PricingContextProps> {
  get channelId(): string { return this.props.channelId; }
  get branchId(): string { return this.props.branchId; }
  private constructor(props: PricingContextProps) { super(props); }
  public static create(props: PricingContextProps): PricingContext {
    return new PricingContext(props);
  }
}