import { WalletCurrency } from '../value-objects/wallet-currency.value-object';
import { WalletBalance } from '../value-objects/wallet-balance.value-object';
import { WalletStatus } from '../value-objects/wallet-status.value-object';
import { IWalletTransaction } from './wallet-transaction.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ICustomerWallet {
  id: string;
  restaurantId: string;
  customerId: string;
  walletNumber: string;
  currency: WalletCurrency;
  balance: WalletBalance;
  status: WalletStatus;
  isFrozen: boolean;
  transactions: IWalletTransaction[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
