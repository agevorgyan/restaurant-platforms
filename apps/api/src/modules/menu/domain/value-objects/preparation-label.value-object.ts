import { ValueObject } from '@saas/core';

export interface PreparationLabelProps { 
  timeInMinutes?: number;
  instructions?: string;
}

export class PreparationLabel extends ValueObject<PreparationLabelProps> {
  get timeInMinutes(): number | undefined { return this.props.timeInMinutes; }
  get instructions(): string | undefined { return this.props.instructions; }

  private constructor(props: PreparationLabelProps) { super(props); }

  public static create(timeInMinutes?: number, instructions?: string): PreparationLabel {
    if (timeInMinutes !== undefined && timeInMinutes <= 0) {
      throw new Error('Preparation time must be positive');
    }
    return new PreparationLabel({ timeInMinutes, instructions });
  }
}