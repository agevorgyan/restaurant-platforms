export type PaymentMethodStatus = 'Active' | 'Inactive' | 'Disabled';

export class PaymentMethodAvailability {
  constructor(public readonly status: PaymentMethodStatus) {
    this.validate(status);
  }

  private validate(status: string): void {
    const valid = ['Active', 'Inactive', 'Disabled'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Payment Method Status: ${status}`);
    }
  }

  public canBeSelected(): boolean {
    return this.status === 'Active';
  }
}
