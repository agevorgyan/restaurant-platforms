import { ValueObject } from '@saas/core';
import { CustomerOrderSummary } from './customer-order-summary.value-object';
import { CustomerOrderStatistics } from './customer-order-statistics.value-object';
import { CustomerOrderCorrelationId } from './customer-order-correlation-id.value-object';

export interface CustomerOrderResponseProps {
  correlationId: CustomerOrderCorrelationId;
  success: boolean;
  summary?: CustomerOrderSummary;
  statistics?: CustomerOrderStatistics;
  errorReason?: string;
}

export class CustomerOrderResponse extends ValueObject<CustomerOrderResponseProps> {
  get correlationId(): CustomerOrderCorrelationId { return this.props.correlationId; }
  get success(): boolean { return this.props.success; }
  get summary(): CustomerOrderSummary | undefined { return this.props.summary; }
  get statistics(): CustomerOrderStatistics | undefined { return this.props.statistics; }
  get errorReason(): string | undefined { return this.props.errorReason; }

  private constructor(props: CustomerOrderResponseProps) { super(props); }
  public static create(props: CustomerOrderResponseProps): CustomerOrderResponse {
    return new CustomerOrderResponse(props);
  }
}