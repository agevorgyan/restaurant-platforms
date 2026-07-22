import { ValueObject } from '@saas/core';

export interface PreparationTimeProps {
  minutes: number;
}

export class PreparationTime extends ValueObject<PreparationTimeProps> {
  get minutes(): number {
    return this.props.minutes;
  }

  private constructor(props: PreparationTimeProps) {
    super(props);
  }

  public static create(minutes: number): PreparationTime {
    if (minutes < 0) {
      throw new Error('Preparation time cannot be negative');
    }
    return new PreparationTime({ minutes });
  }
}
