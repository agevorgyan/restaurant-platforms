export type PromotionStatusEnum = 'Draft' | 'Active' | 'Expired' | 'Disabled';

export class PromotionStatus {
  constructor(public readonly value: PromotionStatusEnum) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Draft', 'Active', 'Expired', 'Disabled'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Promotion Status: ${status}`);
    }
  }

  public canBeApplied(): boolean {
    return this.value === 'Active';
  }
}
