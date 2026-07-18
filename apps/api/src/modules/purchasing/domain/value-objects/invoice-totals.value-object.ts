export class InvoiceTotals {
  public readonly total: number;

  constructor(
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly discount: number
  ) {
    if (subtotal < 0) throw new Error('Subtotal cannot be negative');
    if (tax < 0) throw new Error('Tax cannot be negative');
    if (discount < 0) throw new Error('Discount cannot be negative');

    this.total = subtotal + tax - discount;
  }
}
