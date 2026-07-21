export interface OrderCreatedForAnalyticsPayload {
  orderId: string;
  restaurantId: string;
  totalValue: number;
  itemCount: number;
  source: string;
  createdAt: Date;
}

export interface OrderCompletedForAnalyticsPayload {
  orderId: string;
  restaurantId: string;
  totalValue: number;
  fulfillmentTimeMinutes: number;
  completedAt: Date;
}
