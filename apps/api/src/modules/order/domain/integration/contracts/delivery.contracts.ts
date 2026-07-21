export interface DeliveryRequestedPayload {
  orderId: string;
  restaurantId: string;
  deliveryAddress: {
    line1: string;
    city: string;
    zipCode: string;
  };
  customerContact: {
    name: string;
    phone: string;
  };
}

export interface CourierAssignedPayload {
  orderId: string;
  courierId: string;
  courierName: string;
}

export interface DeliveryStartedPayload {
  orderId: string;
  startedAt: Date;
}

export interface DeliveryCompletedPayload {
  orderId: string;
  completedAt: Date;
}
