import { ValueObject } from '@saas/core';

export interface WaitlistIdProps { value: string; }
export class WaitlistId extends ValueObject<WaitlistIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: WaitlistIdProps) { super(props); }
  public static create(value?: string): WaitlistId { return new WaitlistId({ value: value || crypto.randomUUID() }); }
}