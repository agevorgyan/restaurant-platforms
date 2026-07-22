import { ValueObject } from '@saas/core';

export interface PortionSizeProps {
  size: number;
  unit: string;
}

export class PortionSize extends ValueObject<PortionSizeProps> {
  get size(): number {
    return this.props.size;
  }

  get unit(): string {
    return this.props.unit;
  }

  private constructor(props: PortionSizeProps) {
    super(props);
  }

  public static create(size: number, unit: string): PortionSize {
    if (size <= 0) {
      throw new Error('Portion size must be greater than zero');
    }
    if (!unit || unit.trim().length === 0) {
      throw new Error('Portion unit cannot be empty');
    }
    return new PortionSize({ size, unit: unit.trim() });
  }
}
