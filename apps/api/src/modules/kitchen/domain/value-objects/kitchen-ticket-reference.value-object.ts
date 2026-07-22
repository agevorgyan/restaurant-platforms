import { ValueObject } from '@saas/core';

export interface KitchenTicketReferenceProps {
  ticketId: string;
}

export class KitchenTicketReference extends ValueObject<KitchenTicketReferenceProps> {
  get ticketId(): string {
    return this.props.ticketId;
  }

  private constructor(props: KitchenTicketReferenceProps) {
    super(props);
  }

  public static create(ticketId: string): KitchenTicketReference {
    if (!ticketId || ticketId.trim().length === 0) {
      throw new Error('Ticket reference ID cannot be empty');
    }
    return new KitchenTicketReference({ ticketId: ticketId.trim() });
  }
}
