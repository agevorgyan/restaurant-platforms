import { IPaymentMethod } from '../entities/payment-method.interface';

export interface IPaymentMethodPolicy {
  canBeSelected(paymentMethod: IPaymentMethod): boolean;
  isProviderValidForRestaurant(restaurantId: string, provider: string): Promise<boolean>;
}
