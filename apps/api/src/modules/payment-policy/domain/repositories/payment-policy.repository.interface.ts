import { IPaymentPolicy } from '../entities/payment-policy.interface';

export interface IPaymentPolicyRepository {
  findById(id: string): Promise<IPaymentPolicy | null>;
  findActiveByRestaurantId(restaurantId: string): Promise<IPaymentPolicy | null>;
  save(policy: IPaymentPolicy): Promise<void>;
}
