export type OrderStatusEnum = 'Draft' | 'Pending' | 'Confirmed' | 'Cancelled';

export class OrderStatus {
  constructor(public readonly value: OrderStatusEnum) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Pending', 'Confirmed', 'Cancelled'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Order Status: ${status}`);
    }
  }

  public canBeEdited(): boolean {
    return this.value !== 'Cancelled';
  }

  public canChangeType(): boolean {
    return this.value !== 'Confirmed' && this.value !== 'Cancelled';
  }
}
