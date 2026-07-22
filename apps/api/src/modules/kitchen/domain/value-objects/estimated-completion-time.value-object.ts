import { ValueObject } from '@saas/core';

export interface EstimatedCompletionTimeProps {
  estimatedAt: Date;
}

export class EstimatedCompletionTime extends ValueObject<EstimatedCompletionTimeProps> {
  get estimatedAt(): Date {
    return this.props.estimatedAt;
  }

  private constructor(props: EstimatedCompletionTimeProps) {
    super(props);
  }

  public static create(estimatedAt: Date): EstimatedCompletionTime {
    return new EstimatedCompletionTime({ estimatedAt });
  }

  public static fromNow(minutesToAdd: number): EstimatedCompletionTime {
    if (minutesToAdd < 0) {
      throw new Error('Cannot estimate completion time in the past');
    }
    const estimatedAt = new Date();
    estimatedAt.setMinutes(estimatedAt.getMinutes() + minutesToAdd);
    return new EstimatedCompletionTime({ estimatedAt });
  }
}
