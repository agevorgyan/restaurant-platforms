import { ValueObject } from '@saas/core';

export interface IntegrationCorrelationIdProps { value: string; }

export class IntegrationCorrelationId extends ValueObject<IntegrationCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IntegrationCorrelationIdProps) { super(props); }
  public static create(value?: string): IntegrationCorrelationId {
    return new IntegrationCorrelationId({ value: value || crypto.randomUUID() });
  }
}