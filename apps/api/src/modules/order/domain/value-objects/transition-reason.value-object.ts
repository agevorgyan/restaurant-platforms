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
      throw new Error('Transition reason cannot be empty');
    }
    
    if (value.length > 500) {
      throw new Error('Transition reason cannot exceed 500 characters');
    }

    return new TransitionReason({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
