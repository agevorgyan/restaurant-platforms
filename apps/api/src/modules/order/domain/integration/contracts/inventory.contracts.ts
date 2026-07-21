export interface InventoryReservationRequestedPayload {
  orderId: string;
  restaurantId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface InventoryReservedPayload {
  orderId: string;
  reservationId: string;
}

export interface InventoryReservationFailedPayload {
  orderId: string;
  reason: string;
}
