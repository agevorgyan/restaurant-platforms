import { ValueObject } from '@saas/core';

export interface BatchIdProps {
  value: string;
}

export class BatchId extends ValueObject<BatchIdProps> {
  private constructor(props: BatchIdProps) {
    super(props);
  }

  public static create(value?: string): BatchId {
    return new BatchId({ value: value || crypto.randomUUID() });
  }

  get value(): string {
    return this.props.value;
  }
}
