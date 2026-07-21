export interface KitchenPreparationRequestedPayload {
  orderId: string;
  restaurantId: string;
  priority: string;
  items: Array<{
    productId: string;
    quantity: number;
    notes?: string;
  }>;
}

export interface KitchenStartedPayload {
  orderId: string;
  startedAt: Date;
  estimatedCompletionTime?: Date;
}

export interface KitchenCompletedPayload {
  orderId: string;
  completedAt: Date;
}
