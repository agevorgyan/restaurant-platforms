import { ValueObject } from '@saas/core';

export interface CookingTimeProps {
  minutes: number;
}

export class CookingTime extends ValueObject<CookingTimeProps> {
  get minutes(): number {
    return this.props.minutes;
  }

  private constructor(props: CookingTimeProps) {
    super(props);
  }

  public static create(minutes: number): CookingTime {
    if (minutes < 0) {
      throw new Error('Cooking time cannot be negative');
    }
    return new CookingTime({ minutes });
  }
}
