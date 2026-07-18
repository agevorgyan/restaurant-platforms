export class LoyaltyTransactionReason {
  constructor(public readonly value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Transaction reason cannot be empty');
    }
  }
}
