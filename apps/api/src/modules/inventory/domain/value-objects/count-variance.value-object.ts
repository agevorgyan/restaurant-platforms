export class CountVariance {
  constructor(
    public readonly expected: number,
    public readonly counted: number,
    public readonly variance: number
  ) {
    if (typeof expected !== 'number' || expected < 0) {
      throw new Error('Expected quantity cannot be negative');
    }
    if (typeof counted !== 'number' || counted < 0) {
      throw new Error('Counted quantity cannot be negative');
    }
    if (variance !== counted - expected) {
      throw new Error('Variance must equal counted quantity minus expected quantity');
    }
  }
}
