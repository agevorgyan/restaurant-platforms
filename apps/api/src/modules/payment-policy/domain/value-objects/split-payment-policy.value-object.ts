export class SplitPaymentPolicy {
  constructor(
    public readonly allowSplit: boolean,
    public readonly maxSplits: number
  ) {
    if (allowSplit && maxSplits < 2) {
      throw new Error('If split payments are allowed, max splits must be at least 2');
    }
    if (!allowSplit && maxSplits !== 1) {
      throw new Error('If split payments are not allowed, max splits must be exactly 1');
    }
  }
}
