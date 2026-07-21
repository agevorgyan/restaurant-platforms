import { ValueObject } from '@saas/core';

export interface RefundReferenceProps {
  value: string;
}

export class RefundReference extends ValueObject<RefundReferenceProps> {
  private constructor(props: RefundReferenceProps) {
    super(props);
  }

  public static create(value: string): RefundReference {
    if (!value || value.trim().length === 0) {
      throw new Error('RefundReference cannot be empty');
    }
    return new RefundReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
