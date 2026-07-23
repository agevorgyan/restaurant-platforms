import { ValueObject } from '@saas/core';

export interface GenderProps { value: string; }

export class Gender extends ValueObject<GenderProps> {
  get value(): string { return this.props.value; }
  private constructor(props: GenderProps) { super(props); }
  public static create(value: string): Gender {
    return new Gender({ value });
  }
}