export type OrderItemStatusType = 'Pending' | 'Confirmed' | 'Preparing' | 'Completed' | 'Cancelled';

export class OrderItemStatus {
  constructor(public readonly value: OrderItemStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Pending', 'Confirmed', 'Preparing', 'Completed', 'Cancelled'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Order Item Status: ${status}`);
    }
  }

  public canBeEdited(): boolean {
    return this.value !== 'Cancelled';
  }

  public areModifiersImmutable(): boolean {
    return this.value === 'Confirmed' || this.value === 'Preparing' || this.value === 'Completed';
  }
}
