export type OrderStatusType = 'Draft' | 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled' | 'Refunded';

export class OrderState {
  constructor(public readonly value: OrderStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Refunded'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Order State: ${status}`);
    }
  }

  public isTerminal(): boolean {
    return this.value === 'Refunded';
  }

  public equals(other: OrderState): boolean {
    return this.value === other.value;
  }
}
