export class CartTotals {
  public readonly itemsTotal: number;
  public readonly grandTotal: number;

  constructor(lineTotals: number[]) {
    this.itemsTotal = lineTotals.reduce((sum, current) => sum + current, 0);
    // Add tax/fees here if they existed, but for now grandTotal = itemsTotal
    this.grandTotal = this.itemsTotal;
  }
}
