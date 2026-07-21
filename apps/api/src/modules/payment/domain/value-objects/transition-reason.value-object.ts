import { ValueObject } from '@saas/core';

export interface TransitionReasonProps {
  value: string;
}

export class TransitionReason extends ValueObject<TransitionReasonProps> {
  private constructor(props: TransitionReasonProps) {
    super(props);
  }

  public static create(value: string): TransitionReason {
    if (!value || value.trim().length === 0) {
      throw new Error('TransitionReason cannot be empty');
    }
    return new TransitionReason({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
