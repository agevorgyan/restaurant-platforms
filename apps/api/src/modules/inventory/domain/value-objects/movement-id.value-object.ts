import { ValueObject } from '@saas/core';

export interface MovementIdProps {
  value: string;
}

export class MovementId extends ValueObject<MovementIdProps> {
  private constructor(props: MovementIdProps) {
    super(props);
  }

  public static create(value?: string): MovementId {
    return new MovementId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
