export class WasteFactor {
  constructor(public readonly percentage: number) {
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      throw new Error('Waste factor must be between 0 and 100 percent');
    }
  }
}
