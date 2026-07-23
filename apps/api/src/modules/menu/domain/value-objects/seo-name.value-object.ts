import { ValueObject } from '@saas/core';

export interface SEONameProps { value: string; }

export class SEOName extends ValueObject<SEONameProps> {
  get value(): string { return this.props.value; }
  private constructor(props: SEONameProps) { super(props); }
  public static create(value: string): SEOName {
    return new SEOName({ value: value.trim() });
  }
}