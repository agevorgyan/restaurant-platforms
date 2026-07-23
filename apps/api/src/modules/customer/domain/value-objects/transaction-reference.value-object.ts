import { ValueObject } from '@saas/core';

export interface TransactionReferenceProps { ref: string; }

export class TransactionReference extends ValueObject<TransactionReferenceProps> {
  get ref(): string { return this.props.ref; }
  private constructor(props: TransactionReferenceProps) { super(props); }
  public static create(ref: string): TransactionReference {
    return new TransactionReference({ ref });
  }
}