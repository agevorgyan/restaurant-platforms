export class MovementQuantity {
  constructor(public readonly value: number) {
    if (typeof value !== 'number' || value <= 0) {
      throw new Error('Movement quantity must be greater than zero');
    }
  }
}
