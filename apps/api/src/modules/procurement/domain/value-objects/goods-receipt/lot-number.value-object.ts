import { ValueObject } from '@saas/core';

export interface LotNumberProps { value: string; }

export class LotNumber extends ValueObject<LotNumberProps> {
  get value(): string { return this.props.value; }
  private constructor(props: LotNumberProps) { super(props); }
  public static create(value: string): LotNumber {
    if (!value || value.trim() === '') throw new Error('LotNumber cannot be empty');
    return new LotNumber({ value: value.trim() });
  }
}