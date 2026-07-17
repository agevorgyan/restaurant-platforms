export type PaymentStatusType = 'Pending' | 'Authorized' | 'Captured' | 'Cancelled' | 'Failed' | 'Refunded';

export class PaymentStatus {
  constructor(public readonly value: PaymentStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Pending', 'Authorized', 'Captured', 'Cancelled', 'Failed', 'Refunded'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Payment Status: ${status}`);
    }
  }

  public isTerminal(): boolean {
    return this.value === 'Refunded';
  }

  public canTransitionTo(newStatus: PaymentStatusType): boolean {
    if (this.isTerminal()) {
      return false;
    }
    if (this.value === 'Cancelled' && newStatus === 'Captured') {
      return false; // Cancelled payments cannot be captured
    }
    return true;
  }

  public canChangeAmount(): boolean {
    return this.value !== 'Captured' && this.value !== 'Refunded' && this.value !== 'Cancelled';
  }
}
