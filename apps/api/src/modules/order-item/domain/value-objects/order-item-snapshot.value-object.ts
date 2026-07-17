export class OrderItemSnapshot {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly sku?: string,
    public readonly description?: string,
    public readonly imageUrl?: string,
    public readonly categoryName?: string,
    public readonly taxCategory?: string
  ) {}
}
