export class PreparationLoss {
  constructor(public readonly percentage: number) {
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      throw new Error('Preparation loss must be between 0 and 100 percent');
    }
  }
}
