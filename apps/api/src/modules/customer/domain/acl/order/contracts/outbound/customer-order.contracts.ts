export interface CustomerOrderSummaryRequestedContract {
  version: '1.0';
  customerId: string;
  orderId: string;
  requestedAt: Date;
}

export interface CustomerOrderStatisticsRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}

export interface CustomerEligibilityRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}