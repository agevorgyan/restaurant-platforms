import { ILoyaltyAccount } from '../entities/loyalty-account.interface';

export interface ILoyaltyAccountRepository {
  findById(id: string): Promise<ILoyaltyAccount | null>;
  findByCustomerId(restaurantId: string, customerId: string): Promise<ILoyaltyAccount | null>;
  findByAccountNumber(restaurantId: string, accountNumber: string): Promise<ILoyaltyAccount | null>;
  save(account: ILoyaltyAccount): Promise<void>;
}
