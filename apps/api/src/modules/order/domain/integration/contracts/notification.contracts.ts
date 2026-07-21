export interface ReceiptRequestedPayload {
  orderId: string;
  customerId: string;
  email: string;
  receiptUrl: string;
}

export interface OrderStatusNotificationRequestedPayload {
  orderId: string;
  customerId: string;
  status: string;
  message: string;
}
