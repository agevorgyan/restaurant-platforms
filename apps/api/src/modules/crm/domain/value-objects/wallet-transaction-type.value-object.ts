export type WalletTransactionTypeValue = 'Credit' | 'Debit' | 'Refund' | 'Adjustment' | 'Expiration' | 'TransferIn' | 'TransferOut';

export class WalletTransactionType {
  constructor(public readonly value: WalletTransactionTypeValue) {
    const validTypes = ['Credit', 'Debit', 'Refund', 'Adjustment', 'Expiration', 'TransferIn', 'TransferOut'];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid transaction type: ${value}`);
    }
  }
}
