import { ValueObject } from '@saas/core';

export interface ConcurrencyTokenProps {
  value: string;
}

export class ConcurrencyToken extends ValueObject<ConcurrencyTokenProps> {
  private constructor(props: ConcurrencyTokenProps) {
    super(props);
  }

  public static create(value?: string): ConcurrencyToken {
    return new ConcurrencyToken({ value: value || crypto.randomUUID() });
  }

  public matches(other: ConcurrencyToken): boolean {
    return this.props.value === other.props.value;
  }

  get value(): string {
    return this.props.value;
  }
}
