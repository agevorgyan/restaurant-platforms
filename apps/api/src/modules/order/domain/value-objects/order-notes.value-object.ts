import { ValueObject } from '@saas/core';

export interface OrderNotesProps {
  customerNotes?: string;
  internalNotes?: string;
}

export class OrderNotes extends ValueObject<OrderNotesProps> {
  private static readonly MAX_LENGTH = 500;

  private constructor(props: OrderNotesProps) {
    super(props);
  }

  public static create(props: OrderNotesProps): OrderNotes {
    let customer = props.customerNotes;
    let internal = props.internalNotes;

    if (customer) {
      if (customer.length > OrderNotes.MAX_LENGTH) {
        throw new Error(`Customer notes cannot exceed ${OrderNotes.MAX_LENGTH} characters`);
      }
      customer = this.sanitize(customer);
    }

    if (internal) {
      if (internal.length > OrderNotes.MAX_LENGTH) {
        throw new Error(`Internal notes cannot exceed ${OrderNotes.MAX_LENGTH} characters`);
      }
      internal = this.sanitize(internal);
    }

    return new OrderNotes({ customerNotes: customer, internalNotes: internal });
  }

  private static sanitize(input: string): string {
    // Basic sanitization, removing potentially malicious tag characters
    return input.replace(/[<>]/g, '').trim();
  }

  get customerNotes(): string | undefined { return this.props.customerNotes; }
  get internalNotes(): string | undefined { return this.props.internalNotes; }
}
