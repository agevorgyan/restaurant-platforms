import { CustomerOrderSummary } from '../value-objects/customer-order-summary.value-object';
import { CustomerOrderStatistics } from '../value-objects/customer-order-statistics.value-object';

export class CustomerOrderMapper {
  public mapToSummary(data: any): CustomerOrderSummary {
    return CustomerOrderSummary.create({
      orderRef: data.orderId,
      totalAmount: data.amount || 0,
      status: data.status || 'UNKNOWN'
    });
  }

  public mapToStatistics(data: any): CustomerOrderStatistics {
    return CustomerOrderStatistics.create({
      lifetimeSpend: data.lifetimeSpend || 0,
      orderCount: data.orderCount || 0,
      averageOrderValue: data.averageOrderValue || 0,
      lastOrderDate: data.lastOrderDate,
      customerSegmentHint: data.segment
    });
  }
}