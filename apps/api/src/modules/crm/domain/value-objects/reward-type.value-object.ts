export type RewardTypeValue = 'Points' | 'DiscountPercent' | 'DiscountAmount' | 'FreeItem' | 'Voucher' | 'Gift';

export class RewardType {
  constructor(public readonly value: RewardTypeValue) {
    const validTypes = ['Points', 'DiscountPercent', 'DiscountAmount', 'FreeItem', 'Voucher', 'Gift'];
    if (!validTypes.includes(value)) {
      throw new Error(`Invalid reward type: ${value}`);
    }
  }
}
