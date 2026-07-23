export interface OrderCreatedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  totalAmount: number;
  createdAt: Date;
}

export interface OrderCompletedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  totalAmount: number;
  completedAt: Date;
}

export interface OrderCancelledContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  reason: string;
  cancelledAt: Date;
}

export interface OrderRefundedContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  refundAmount: number;
  refundedAt: Date;
}

export interface CustomerAssignedToOrderContract {
  version: '1.0';
  orderId: string;
  customerId: string;
  assignedAt: Date;
}