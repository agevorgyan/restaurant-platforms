import { ValueObject } from '@saas/core';

export interface CustomerOrderSummaryProps {
  orderRef: string;
  totalAmount: number;
  status: string;
  completedAt?: Date;
}

export class CustomerOrderSummary extends ValueObject<CustomerOrderSummaryProps> {
  get orderRef(): string { return this.props.orderRef; }
  get totalAmount(): number { return this.props.totalAmount; }
  get status(): string { return this.props.status; }
  get completedAt(): Date | undefined { return this.props.completedAt; }

  private constructor(props: CustomerOrderSummaryProps) { super(props); }
  public static create(props: CustomerOrderSummaryProps): CustomerOrderSummary {
    return new CustomerOrderSummary(props);
  }
}