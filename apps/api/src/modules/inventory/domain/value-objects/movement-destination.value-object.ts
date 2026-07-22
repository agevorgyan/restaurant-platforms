import { ValueObject } from '@saas/core';

export interface MovementDestinationProps {
  value: string;
}

export class MovementDestination extends ValueObject<MovementDestinationProps> {
  private constructor(props: MovementDestinationProps) {
    super(props);
  }

  public static create(value: string): MovementDestination {
    if (!value || value.trim() === '') {
      throw new Error('MovementDestination cannot be empty');
    }
    return new MovementDestination({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
