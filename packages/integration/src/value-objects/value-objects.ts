import { Brand } from '@saas/types';
import { ValueObject } from '@saas/core';

export type CorrelationIdProps = { value: string };
export class CorrelationId extends ValueObject<CorrelationIdProps> {
  get value(): string {
    return this.props.value;
  }
  private constructor(props: CorrelationIdProps) {
    super(props);
  }
  public static create(value: string): CorrelationId {
    return new CorrelationId({ value });
  }
}

export type CausationIdProps = { value: string };
export class CausationId extends ValueObject<CausationIdProps> {
  get value(): string {
    return this.props.value;
  }
  private constructor(props: CausationIdProps) {
    super(props);
  }
  public static create(value: string): CausationId {
    return new CausationId({ value });
  }
}

export type IdempotencyKeyProps = { value: string };
export class IdempotencyKey extends ValueObject<IdempotencyKeyProps> {
  get value(): string {
    return this.props.value;
  }
  private constructor(props: IdempotencyKeyProps) {
    super(props);
  }
  public static create(value: string): IdempotencyKey {
    return new IdempotencyKey({ value });
  }
}

export type ExternalReferenceProps = { id: string; context: string };
export class ExternalReference extends ValueObject<ExternalReferenceProps> {
  get id(): string {
    return this.props.id;
  }
  get context(): string {
    return this.props.context;
  }
  private constructor(props: ExternalReferenceProps) {
    super(props);
  }
  public static create(id: string, context: string): ExternalReference {
    return new ExternalReference({ id, context });
  }
}
