export type LoyaltyTransactionTypeValue = 'Earn' | 'Redeem' | 'Expire' | 'Adjustment' | 'Refund';

export class LoyaltyTransactionType {
  constructor(public readonly value: LoyaltyTransactionTypeValue) {
    const validTypes = ['Earn', 'Redeem', 'Expire', 'Adjustment', 'Refund'];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid transaction type: ${value}`);
    }
  }
}
