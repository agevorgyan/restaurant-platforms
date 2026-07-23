import { ValueObject } from '@saas/core';

export interface ProcurementCausationIdProps { value: string; }

export class ProcurementCausationId extends ValueObject<ProcurementCausationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: ProcurementCausationIdProps) { super(props); }
  public static create(value: string): ProcurementCausationId {
    if (!value) throw new Error('CausationId is required');
    return new ProcurementCausationId({ value });
  }
}