export class AdjustmentQuantity {
  constructor(
    public readonly expected: number,
    public readonly actual: number,
    public readonly difference: number
  ) {
    if (typeof expected !== 'number' || expected < 0) {
      throw new Error('Expected quantity cannot be negative');
    }
    if (typeof actual !== 'number' || actual < 0) {
      throw new Error('Actual quantity cannot be negative');
    }
    if (difference !== actual - expected) {
      throw new Error('Difference quantity must equal actual minus expected');
    }
  }
}
