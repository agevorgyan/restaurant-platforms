import { IPaymentMethod } from '../entities/payment-method.interface';
import { PaymentProviderType } from '../value-objects/payment-method-configuration.value-object';

export interface IPaymentMethodRepository {
  findById(id: string): Promise<IPaymentMethod | null>;
  findByRestaurantId(restaurantId: string): Promise<IPaymentMethod[]>;
  findByProvider(restaurantId: string, provider: PaymentProviderType): Promise<IPaymentMethod | null>;
  findDefaultByType(restaurantId: string, paymentType: string): Promise<IPaymentMethod | null>;
  save(paymentMethod: IPaymentMethod): Promise<void>;
}
