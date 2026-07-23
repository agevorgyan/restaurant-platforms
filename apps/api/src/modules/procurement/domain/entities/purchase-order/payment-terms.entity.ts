import { Entity } from '@saas/core';

export interface PaymentTermsProps {
  termCode: string;
  daysToPay: number;
  discountPercentage?: number;
}

export class PaymentTerms extends Entity<PaymentTermsProps> {
  get termCode(): string { return this.props.termCode; }
  get daysToPay(): number { return this.props.daysToPay; }
  get discountPercentage(): number | undefined { return this.props.discountPercentage; }

  private constructor(id: string, props: PaymentTermsProps) { super(id, props); }

  public static create(props: PaymentTermsProps, id?: string): PaymentTerms {
    if (props.daysToPay < 0) throw new Error('Days to pay cannot be negative');
    return new PaymentTerms(id || crypto.randomUUID(), props);
  }
}