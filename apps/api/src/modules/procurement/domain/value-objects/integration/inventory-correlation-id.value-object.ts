import { ValueObject } from '@saas/core';

export interface InventoryCorrelationIdProps { value: string; }

export class InventoryCorrelationId extends ValueObject<InventoryCorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: InventoryCorrelationIdProps) { super(props); }
  public static create(value?: string): InventoryCorrelationId {
    return new InventoryCorrelationId({ value: value || crypto.randomUUID() });
  }
}