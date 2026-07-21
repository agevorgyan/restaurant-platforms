import { ValueObject } from '@saas/core';

export interface CaptureReferenceProps {
  value: string;
}

export class CaptureReference extends ValueObject<CaptureReferenceProps> {
  private constructor(props: CaptureReferenceProps) {
    super(props);
  }

  public static create(value: string): CaptureReference {
    if (!value || value.trim().length === 0) {
      throw new Error('CaptureReference cannot be empty');
    }
    return new CaptureReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
