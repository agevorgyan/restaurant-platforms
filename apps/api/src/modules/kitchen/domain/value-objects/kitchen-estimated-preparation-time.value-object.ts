import { ValueObject } from '@saas/core';

export interface KitchenEstimatedPreparationTimeProps {
  minutes: number;
}

export class KitchenEstimatedPreparationTime extends ValueObject<KitchenEstimatedPreparationTimeProps> {
  get minutes(): number {
    return this.props.minutes;
  }

  private constructor(props: KitchenEstimatedPreparationTimeProps) {
    super(props);
  }

  public static create(minutes: number): KitchenEstimatedPreparationTime {
    if (minutes < 0) {
      throw new Error('Estimated preparation time cannot be negative');
    }
    return new KitchenEstimatedPreparationTime({ minutes });
  }
}
