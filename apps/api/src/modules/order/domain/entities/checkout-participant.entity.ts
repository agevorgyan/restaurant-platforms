import { Entity } from '@saas/core';

export interface CheckoutParticipantProps {
  userId?: string;
  guestToken?: string;
  deviceId?: string;
}

export class CheckoutParticipant extends Entity<CheckoutParticipantProps> {
  private constructor(id: string, props: CheckoutParticipantProps) {
    super(id, props);
  }

  public static create(props: CheckoutParticipantProps, id?: string): CheckoutParticipant {
    if (!props.userId && !props.guestToken) {
      throw new Error('CheckoutParticipant must have either a userId or a guestToken');
    }
    return new CheckoutParticipant(id || crypto.randomUUID(), props);
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get guestToken(): string | undefined {
    return this.props.guestToken;
  }

  get deviceId(): string | undefined {
    return this.props.deviceId;
  }
}
