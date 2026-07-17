export type TaxStatusType = 'Active' | 'Inactive';

export class TaxStatus {
  constructor(public readonly value: TaxStatusType) {
    this.validate(value);
  }

  private validate(status: string): void {
    const valid = ['Active', 'Inactive'];
    if (!valid.includes(status)) {
      throw new Error(`Invalid Tax Status: ${status}`);
    }
  }

  public canBeApplied(): boolean {
    return this.value === 'Active';
  }
}
