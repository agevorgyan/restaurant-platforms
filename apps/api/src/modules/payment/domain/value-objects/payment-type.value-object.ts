export type PaymentTypeEnum = 'Cash' | 'Card' | 'Online' | 'GiftCard' | 'StoreCredit' | 'SplitPayment';

export class PaymentType {
  constructor(public readonly value: PaymentTypeEnum) {
    const valid = ['Cash', 'Card', 'Online', 'GiftCard', 'StoreCredit', 'SplitPayment'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Payment Type: ${value}`);
    }
  }
}
