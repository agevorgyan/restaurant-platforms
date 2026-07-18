import { WalletTransactionType } from '../value-objects/wallet-transaction-type.value-object';
import { WalletTransactionStatus } from '../value-objects/wallet-transaction-status.value-object';
import { WalletCurrency } from '../value-objects/wallet-currency.value-object';
import { WalletReference } from '../value-objects/wallet-reference.value-object';

export interface IWalletTransaction {
  id: string;
  transactionType: WalletTransactionType;
  status: WalletTransactionStatus;
  amount: number;
  currency: WalletCurrency;
  reference: WalletReference;
  description?: string;
  occurredAt: Date;
}
