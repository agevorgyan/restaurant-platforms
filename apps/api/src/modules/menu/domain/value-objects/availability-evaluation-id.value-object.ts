import { ValueObject } from '@saas/core';

export interface AvailabilityEvaluationIdProps { value: string; }

export class AvailabilityEvaluationId extends ValueObject<AvailabilityEvaluationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: AvailabilityEvaluationIdProps) { super(props); }
  public static create(value?: string): AvailabilityEvaluationId {
    return new AvailabilityEvaluationId({ value: value || crypto.randomUUID() });
  }
}