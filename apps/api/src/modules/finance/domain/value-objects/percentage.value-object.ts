import { ValueObject } from '@saas/core';

export interface PercentageProps {
  value: number; // Stored as a decimal fraction (e.g. 0.15 for 15%)
}

export class Percentage extends ValueObject<PercentageProps> {
  private constructor(props: PercentageProps) {
    super(props);
  }

  /**
   * Creates a Percentage from a value like 15 (for 15%).
   * Internally stored as 0.15.
   */
  public static create(value: number, allowOver100: boolean = false): Percentage {
    if (!Number.isFinite(value) || Number.isNaN(value)) {
      throw new Error('Percentage must be a finite number');
    }
    if (value < 0) {
      throw new Error('Percentage cannot be negative');
    }
    if (!allowOver100 && value > 100) {
      throw new Error('Percentage cannot exceed 100 unless explicitly allowed');
    }

    return new Percentage({ value: value / 100 });
  }

  get value(): number {
    return this.props.value;
  }
}
