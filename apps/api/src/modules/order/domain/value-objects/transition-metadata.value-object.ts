import { ValueObject } from '@saas/core';

export interface TransitionMetadataProps {
  value: Record<string, any>;
}

export class TransitionMetadata extends ValueObject<TransitionMetadataProps> {
  private constructor(props: TransitionMetadataProps) {
    super(props);
  }

  public static create(value?: Record<string, any>): TransitionMetadata {
    // If no metadata is provided, default to an empty record
    if (!value) {
      return new TransitionMetadata({ value: {} });
    }

    // Ensure serializability by attempting to stringify
    try {
      JSON.stringify(value);
    } catch {
      throw new Error('Transition metadata must be serializable');
    }

    return new TransitionMetadata({ value });
  }

  get value(): Record<string, any> {
    return this.props.value;
  }
}
