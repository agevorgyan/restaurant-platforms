import { ValueObject } from '@saas/core';

export interface PricingEvaluationIdProps { value: string; }

export class PricingEvaluationId extends ValueObject<PricingEvaluationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: PricingEvaluationIdProps) { super(props); }
  public static create(value?: string): PricingEvaluationId {
    return new PricingEvaluationId({ value: value || crypto.randomUUID() });
  }
}