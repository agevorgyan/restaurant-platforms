import { ValueObject } from '@saas/core';

export interface ProcurementCorrelationIdProps { value: string; }

export class ProcurementCorrelationId extends ValueObject<ProcurementCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ProcurementCorrelationIdProps) { super(props); }
  public static create(value?: string): ProcurementCorrelationId {
    return new ProcurementCorrelationId({ value: value || crypto.randomUUID() });
  }
}