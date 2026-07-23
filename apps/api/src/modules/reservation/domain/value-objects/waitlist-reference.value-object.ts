import { ValueObject } from '@saas/core';

export interface WaitlistReferenceProps { waitlistId: string; }
export class WaitlistReference extends ValueObject<WaitlistReferenceProps> {
  get waitlistId(): string { return this.props.waitlistId; }
  private constructor(props: WaitlistReferenceProps) { super(props); }
  public static create(waitlistId: string): WaitlistReference { return new WaitlistReference({ waitlistId }); }
}