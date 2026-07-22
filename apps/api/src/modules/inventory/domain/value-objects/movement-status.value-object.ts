import { ValueObject } from '@saas/core';

export enum MovementStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface MovementStatusProps {
  value: MovementStatusEnum;
}

export class MovementStatus extends ValueObject<MovementStatusProps> {
  private constructor(props: MovementStatusProps) {
    super(props);
  }

  public static create(value: MovementStatusEnum): MovementStatus {
    return new MovementStatus({ value });
  }

  get value(): MovementStatusEnum {
    return this.props.value;
  }
}
