export class TaxBreakdown {
  constructor(
    public readonly taxRate: number,
    public readonly taxableAmount: number,
    public readonly taxAmount: number
  ) {
    if (taxRate < 0) throw new Error('Tax rate cannot be negative');
    if (taxableAmount < 0) throw new Error('Taxable amount cannot be negative');
    if (taxAmount < 0) throw new Error('Tax amount cannot be negative');
  }
}
