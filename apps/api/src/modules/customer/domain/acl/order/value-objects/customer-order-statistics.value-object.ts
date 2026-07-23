import { ValueObject } from '@saas/core';

export interface CustomerOrderStatisticsProps {
  lifetimeSpend: number;
  orderCount: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  customerSegmentHint?: string;
}

export class CustomerOrderStatistics extends ValueObject<CustomerOrderStatisticsProps> {
  get lifetimeSpend(): number { return this.props.lifetimeSpend; }
  get orderCount(): number { return this.props.orderCount; }
  get averageOrderValue(): number { return this.props.averageOrderValue; }
  get lastOrderDate(): Date | undefined { return this.props.lastOrderDate; }
  get customerSegmentHint(): string | undefined { return this.props.customerSegmentHint; }

  private constructor(props: CustomerOrderStatisticsProps) { super(props); }
  public static create(props: CustomerOrderStatisticsProps): CustomerOrderStatistics {
    return new CustomerOrderStatistics(props);
  }
}