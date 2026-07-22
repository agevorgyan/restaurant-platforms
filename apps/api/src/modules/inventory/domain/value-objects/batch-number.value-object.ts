import { ValueObject } from '@saas/core';

export interface BatchNumberProps {
  value: string;
}

export class BatchNumber extends ValueObject<BatchNumberProps> {
  private constructor(props: BatchNumberProps) {
    super(props);
  }

  public static create(value: string): BatchNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Batch number cannot be empty');
    }
    const cleanValue = value.trim();
    if (cleanValue.length > 100) {
      throw new Error('Batch number must be 100 characters or less');
    }
    return new BatchNumber({ value: cleanValue });
  }

  get value(): string {
    return this.props.value;
  }
}
