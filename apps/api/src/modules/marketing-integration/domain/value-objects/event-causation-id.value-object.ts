import { ValueObject } from '@saas/core';

export interface EventCausationIdProps {
  value: string;
}

export class EventCausationId extends ValueObject<EventCausationIdProps> {
  private constructor(props: EventCausationIdProps) {
    super(props);
  }

  public static create(value: string): EventCausationId {
    if (!value || value.trim().length === 0) {
      throw new Error('EventCausationId cannot be empty');
    }
    return new EventCausationId({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
