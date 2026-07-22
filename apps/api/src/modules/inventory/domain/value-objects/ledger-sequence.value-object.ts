import { ValueObject } from '@saas/core';

export interface LedgerSequenceProps {
  value: number;
}

export class LedgerSequence extends ValueObject<LedgerSequenceProps> {
  private constructor(props: LedgerSequenceProps) {
    super(props);
  }

  public static create(value: number): LedgerSequence {
    if (value < 1 || !Number.isInteger(value)) {
      throw new Error('Ledger sequence must be a positive integer');
    }
    return new LedgerSequence({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public next(): LedgerSequence {
    return LedgerSequence.create(this.props.value + 1);
  }
}
