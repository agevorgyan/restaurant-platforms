import { Entity } from '@saas/core';
import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { CaptureReference } from '../value-objects/capture-reference.value-object';

export interface ChargebackProps {
  captureReference: CaptureReference;
  amount: PaymentAmount;
  reason: string;
  createdAt: Date;
}

export class Chargeback extends Entity<ChargebackProps> {
  private constructor(props: ChargebackProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(
    captureReference: CaptureReference,
    amount: PaymentAmount,
    reason: string,
    id?: string
  ): Chargeback {
    if (!captureReference || !amount || !reason || reason.trim() === '') {
      throw new Error('Chargeback must have captureReference, amount, and reason');
    }
    
    return new Chargeback({
      captureReference,
      amount,
      reason,
      createdAt: new Date()
    }, id);
  }

  get captureReference(): CaptureReference { return this.props.captureReference; }
  get amount(): PaymentAmount { return this.props.amount; }
  get reason(): string { return this.props.reason; }
  get createdAt(): Date { return this.props.createdAt; }
}
