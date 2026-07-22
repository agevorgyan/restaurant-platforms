import { ValueObject } from '@saas/core';

export interface LedgerVersionProps {
  value: number;
}

export class LedgerVersion extends ValueObject<LedgerVersionProps> {
  private constructor(props: LedgerVersionProps) {
    super(props);
  }

  public static create(value: number): LedgerVersion {
    if (value < 1 || !Number.isInteger(value)) {
      throw new Error('Ledger version must be a positive integer');
    }
    return new LedgerVersion({ value });
  }

  get value(): number {
    return this.props.value;
  }
}
