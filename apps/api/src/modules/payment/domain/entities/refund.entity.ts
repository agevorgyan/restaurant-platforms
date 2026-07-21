import { Entity } from '@saas/core';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { RefundReference } from '../value-objects/refund-reference.value-object';

export interface RefundProps {
  reference: RefundReference;
  amount: PaymentAmount;
  reason: string;
  createdAt: Date;
}

export class Refund extends Entity<RefundProps> {
  private constructor(props: RefundProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    reference: RefundReference,
    amount: PaymentAmount,
    reason: string,
    id?: string
  ): Refund {
    if (!reference || !amount || !reason || reason.trim() === '') {
      throw new Error('Refund must have reference, amount, and reason');
    }
    
    return new Refund({
      reference,
      amount,
      reason,
      createdAt: new Date()
    }, id);
  }

  get reference(): RefundReference { return this.props.reference; }
  get amount(): PaymentAmount { return this.props.amount; }
  get reason(): string { return this.props.reason; }
  get createdAt(): Date { return this.props.createdAt; }
}
