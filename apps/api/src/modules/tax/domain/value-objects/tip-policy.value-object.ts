export class TipPolicy {
  constructor(
    public readonly enabled: boolean,
    public readonly suggestedPercentages: number[] = []
  ) {
    this.validate();
  }

  private validate(): void {
    for (const percentage of this.suggestedPercentages) {
      if (percentage < 0 || percentage > 100) {
        throw new Error('Suggested tip percentages must be between 0 and 100');
      }
    }
  }
}
