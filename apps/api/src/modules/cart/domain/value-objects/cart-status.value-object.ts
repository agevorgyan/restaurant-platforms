export type CartStatusType = 'Active' | 'CheckedOut' | 'Expired' | 'Abandoned';

export class CartStatus {
  constructor(public readonly value: CartStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Active', 'CheckedOut', 'Expired', 'Abandoned'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Cart Status: ${status}`);
    }
  }

  public isReadOnly(): boolean {
    return this.value === 'CheckedOut' || this.value === 'Expired' || this.value === 'Abandoned';
  }

  public canCheckout(): boolean {
    return this.value === 'Active';
  }
}
