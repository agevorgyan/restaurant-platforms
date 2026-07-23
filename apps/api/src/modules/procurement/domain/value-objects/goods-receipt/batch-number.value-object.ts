import { ValueObject } from '@saas/core';

export interface BatchNumberProps { value: string; }

export class BatchNumber extends ValueObject<BatchNumberProps> {
  get value(): string { return this.props.value; }
  private constructor(props: BatchNumberProps) { super(props); }
  public static create(value: string): BatchNumber {
    if (!value || value.trim() === '') throw new Error('BatchNumber cannot be empty');
    return new BatchNumber({ value: value.trim() });
  }
}