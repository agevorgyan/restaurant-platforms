import { ThemeSettings } from '../value-objects';

export interface IRestaurantSettings {
  id: string;
  restaurantId: string;
  currency: string;
  timezone: string;
  taxRate: number;
  acceptsReservations: boolean;
  acceptsDelivery: boolean;
  acceptsPickup: boolean;
  theme: ThemeSettings;
  updatedAt: Date;
}
