import { ValueObject } from '@saas/core';

export interface MovementSourceProps {
  value: string;
}

export class MovementSource extends ValueObject<MovementSourceProps> {
  private constructor(props: MovementSourceProps) {
    super(props);
  }

  public static create(value: string): MovementSource {
    if (!value || value.trim() === '') {
      throw new Error('MovementSource cannot be empty');
    }
    return new MovementSource({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
