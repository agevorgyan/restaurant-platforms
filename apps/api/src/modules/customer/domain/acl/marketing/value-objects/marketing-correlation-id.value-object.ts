import { ValueObject } from '@saas/core';

export interface MarketingCorrelationIdProps { value: string; }

export class MarketingCorrelationId extends ValueObject<MarketingCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: MarketingCorrelationIdProps) { super(props); }
  public static create(value?: string): MarketingCorrelationId {
    return new MarketingCorrelationId({ value: value || crypto.randomUUID() });
  }
}