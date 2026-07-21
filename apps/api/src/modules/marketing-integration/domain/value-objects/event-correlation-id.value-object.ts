import { ValueObject } from '@saas/core';

export interface EventCorrelationIdProps {
  value: string;
}

export class EventCorrelationId extends ValueObject<EventCorrelationIdProps> {
  private constructor(props: EventCorrelationIdProps) {
    super(props);
  }

  public static create(value: string): EventCorrelationId {
    if (!value || value.trim().length === 0) {
      throw new Error('EventCorrelationId cannot be empty');
    }
    return new EventCorrelationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
