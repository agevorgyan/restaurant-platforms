import { ValueObject } from '@saas/core';

export interface SubscriptionReferenceProps { subscriptionId: string; }

export class SubscriptionReference extends ValueObject<SubscriptionReferenceProps> {
  get subscriptionId(): string { return this.props.subscriptionId; }
  private constructor(props: SubscriptionReferenceProps) { super(props); }
  public static create(subscriptionId: string): SubscriptionReference {
    return new SubscriptionReference({ subscriptionId });
  }
}