export class PurchaseOrderTotals {
  public readonly total: number;

  constructor(
    public readonly subtotal: number,
    public readonly discount: number,
    public readonly tax: number
  ) {
    if (subtotal < 0) throw new Error('Subtotal cannot be negative');
    if (discount < 0) throw new Error('Discount cannot be negative');
    if (tax < 0) throw new Error('Tax cannot be negative');

    this.total = subtotal - discount + tax;
  }
}
