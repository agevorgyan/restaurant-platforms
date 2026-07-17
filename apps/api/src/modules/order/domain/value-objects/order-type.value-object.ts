export type OrderTypeEnum = 'DineIn' | 'Takeaway' | 'Delivery' | 'Pickup' | 'QRTable';

export class OrderType {
  constructor(public readonly value: OrderTypeEnum) {
    this.validate(value);
  }

  private validate(type: string): void {
    const valid = ['DineIn', 'Takeaway', 'Delivery', 'Pickup', 'QRTable'];
    if (!valid.includes(type)) {
      throw new Error(`Invalid Order Type: ${type}`);
    }
  }
}
