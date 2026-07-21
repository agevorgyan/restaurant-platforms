export interface OrderQuotationAcceptedPayload {
  orderId: string;
  quotationId: string;
  restaurantId: string;
  acceptedAt: Date;
}

export interface PricingSnapshotAttachedPayload {
  orderId: string;
  pricingSnapshotId: string;
  totalAmount: number;
  currency: string;
}
