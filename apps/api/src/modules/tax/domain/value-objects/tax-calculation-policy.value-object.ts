export type CalculationModeEnum = 'Inclusive' | 'Exclusive' | 'Compound';

export class TaxCalculationPolicy {
  constructor(public readonly mode: CalculationModeEnum) {
    this.validate(mode);
  }

  private validate(mode: string): void {
    const valid = ['Inclusive', 'Exclusive', 'Compound'];
    if (!valid.includes(mode)) {
      throw new Error(`Invalid Calculation Mode: ${mode}`);
    }
  }
}
