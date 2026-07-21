import { Entity } from '@saas/core';

export interface PaymentIntentParticipantProps {
  customerId: string;
}

export class PaymentIntentParticipant extends Entity<PaymentIntentParticipantProps> {
  private constructor(props: PaymentIntentParticipantProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: PaymentIntentParticipantProps, id?: string): PaymentIntentParticipant {
    if (!props.customerId || props.customerId.trim() === '') {
      throw new Error('PaymentIntentParticipant must have a valid customerId');
    }
    return new PaymentIntentParticipant(props, id);
  }

  get customerId(): string {
    return this.props.customerId;
  }
}
