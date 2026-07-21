import { ValueObject } from '@saas/core';

export interface EventVersionProps {
  value: number;
}

export class EventVersion extends ValueObject<EventVersionProps> {
  private constructor(props: EventVersionProps) {
    super(props);
  }

  public static create(value: number): EventVersion {
    if (value <= 0) {
      throw new Error('EventVersion must be strictly positive');
    }
    return new EventVersion({ value });
  }

  public static initial(): EventVersion {
    return new EventVersion({ value: 1 });
  }

  get value(): number {
    return this.props.value;
  }
}
