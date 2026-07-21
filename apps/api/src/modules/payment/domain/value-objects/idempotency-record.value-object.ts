import { ValueObject } from '@saas/core';

export interface IdempotencyRecordProps {
  key: string;
  response: any;
  createdAt: Date;
}

export class IdempotencyRecord extends ValueObject<IdempotencyRecordProps> {
  private constructor(props: IdempotencyRecordProps) {
    super(props);
  }

  public static create(key: string, response: any, createdAt: Date = new Date()): IdempotencyRecord {
    if (!key || key.trim() === '') {
      throw new Error('Idempotency key cannot be empty');
    }
    return new IdempotencyRecord({ key, response, createdAt });
  }

  get key(): string {
    return this.props.key;
  }

  get response(): any {
    return this.props.response;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
