import { ValueObject } from '@saas/core';

export interface IdempotencyKeyProps {
  value: string;
}

export class IdempotencyKey extends ValueObject<IdempotencyKeyProps> {
  private constructor(props: IdempotencyKeyProps) {
    super(props);
  }

  public static create(value?: string): IdempotencyKey {
    const id = value || crypto.randomUUID();
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('IdempotencyKey must be a valid UUID');
    }

    return new IdempotencyKey({ value: id });
  }

  get value(): string {
    return this.props.value;
  }
}
