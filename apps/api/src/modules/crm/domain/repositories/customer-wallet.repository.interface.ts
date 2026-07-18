import { ICustomerWallet } from '../entities/customer-wallet.interface';

export interface ICustomerWalletRepository {
  findById(id: string): Promise<ICustomerWallet | null>;
  findByCustomerId(restaurantId: string, customerId: string): Promise<ICustomerWallet | null>;
  findByWalletNumber(restaurantId: string, walletNumber: string): Promise<ICustomerWallet | null>;
  save(wallet: ICustomerWallet): Promise<void>;
}
