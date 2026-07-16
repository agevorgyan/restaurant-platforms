export class ProductPrice {
  constructor(
    public readonly price: number,
    public readonly currency: string,
    public readonly compareAtPrice?: number,
    public readonly costPrice?: number,
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (this.compareAtPrice !== undefined && this.compareAtPrice !== null) {
      if (this.compareAtPrice < this.price) {
        throw new Error('Compare-at price must be greater than or equal to price');
      }
    }

    if (this.costPrice !== undefined && this.costPrice !== null) {
      if (this.costPrice < 0) {
        throw new Error('Cost price cannot be negative');
      }
    }
  }
}
