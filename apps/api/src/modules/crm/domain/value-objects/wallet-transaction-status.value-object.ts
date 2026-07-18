export type WalletTransactionStatusValue = 'Pending' | 'Completed' | 'Failed';

export class WalletTransactionStatus {
  constructor(public readonly value: WalletTransactionStatusValue) {
    const validStatuses = ['Pending', 'Completed', 'Failed'];
    if (!validStatuses.includes(value)) {
      throw new Error(`Invalid transaction status: ${value}`);
    }
  }
}
