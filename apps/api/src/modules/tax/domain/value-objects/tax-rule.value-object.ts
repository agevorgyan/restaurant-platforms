export type TaxTypeEnum = 'VAT' | 'SalesTax' | 'GST' | 'Custom';

export class TaxRule {
  constructor(
    public readonly name: string,
    public readonly type: TaxTypeEnum,
    public readonly percentage: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error('Tax percentages must be between 0 and 100');
    }
    const valid = ['VAT', 'SalesTax', 'GST', 'Custom'];
    if (!valid.includes(this.type)) {
      throw new Error(`Invalid Tax Type: ${this.type}`);
    }
  }
}
