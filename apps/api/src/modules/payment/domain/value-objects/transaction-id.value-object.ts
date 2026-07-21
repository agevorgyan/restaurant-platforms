import { ValueObject } from '@saas/core';

export interface TransactionIdProps {
  value: string;
}

export class TransactionId extends ValueObject<TransactionIdProps> {
  private constructor(props: TransactionIdProps) {
    super(props);
  }

  public static create(value?: string): TransactionId {
    const id = value || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('TransactionId must be a valid UUID');
    }

    return new TransactionId({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
