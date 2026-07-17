export class TaxSummary {
  constructor(
    public readonly breakdown: Array<{
      taxName: string;
      taxRate: number;
      taxableAmount: number; // minor units
      taxAmount: number; // minor units
    }>,
    public readonly totalTaxAmount: number // minor units
  ) {
    const calculatedTotal = breakdown.reduce((sum, b) => sum + b.taxAmount, 0);
    if (calculatedTotal !== totalTaxAmount) {
      throw new Error('Total tax amount does not match the sum of the breakdown');
    }
  }
}
