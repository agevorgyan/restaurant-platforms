import { ValueObject } from '@saas/core';

export interface ACLCorrelationIdProps { value: string; causationId?: string; }

export class ACLCorrelationId extends ValueObject<ACLCorrelationIdProps> {
  get value(): string { return this.props.value; }
  get causationId(): string | undefined { return this.props.causationId; }
  private constructor(props: ACLCorrelationIdProps) { super(props); }
  public static create(value?: string, causationId?: string): ACLCorrelationId {
    return new ACLCorrelationId({ value: value || crypto.randomUUID(), causationId });
  }
}