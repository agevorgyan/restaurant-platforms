export class MinimumOrderQuantity {
  constructor(public readonly value: number) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Minimum order quantity must be greater than zero');
    }
  }
}
