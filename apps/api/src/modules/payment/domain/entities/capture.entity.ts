import { Entity } from '@saas/core';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { CaptureReference } from '../value-objects/capture-reference.value-object';

export interface CaptureProps {
  reference: CaptureReference;
  amount: PaymentAmount;
  createdAt: Date;
}

export class Capture extends Entity<CaptureProps> {
  private constructor(props: CaptureProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    reference: CaptureReference,
    amount: PaymentAmount,
    id?: string
  ): Capture {
    if (!reference || !amount) {
      throw new Error('Capture must have reference and amount');
    }
    
    return new Capture({
      reference,
      amount,
      createdAt: new Date()
    }, id);
  }

  get reference(): CaptureReference { return this.props.reference; }
  get amount(): PaymentAmount { return this.props.amount; }
  get createdAt(): Date { return this.props.createdAt; }
}
