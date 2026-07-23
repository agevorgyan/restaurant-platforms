import { ValueObject } from '@saas/core';

export interface PricingCorrelationIdProps { value: string; }

export class PricingCorrelationId extends ValueObject<PricingCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PricingCorrelationIdProps) { super(props); }
  public static create(value?: string): PricingCorrelationId {
    return new PricingCorrelationId({ value: value || crypto.randomUUID() });
  }
}