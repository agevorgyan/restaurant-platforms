export interface IRestaurantSettings {
  id: string;
  restaurantId: string;
  currency: string;
  timezone: string;
  taxRate: number;
  acceptsReservations: boolean;
  acceptsDelivery: boolean;
  acceptsPickup: boolean;
  updatedAt: Date;
}
