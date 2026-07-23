import { ValueObject } from '@saas/core';

export interface GuestReferenceProps { guestId: string; name?: string; }
export class GuestReference extends ValueObject<GuestReferenceProps> {
  get guestId(): string { return this.props.guestId; }
  get name(): string | undefined { return this.props.name; }
  private constructor(props: GuestReferenceProps) { super(props); }
  public static create(guestId: string, name?: string): GuestReference { return new GuestReference({ guestId, name }); }
}