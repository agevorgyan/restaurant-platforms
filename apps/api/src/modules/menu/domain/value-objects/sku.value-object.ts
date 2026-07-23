import { ValueObject } from '@saas/core';

export interface SKUProps { value: string; }

export class SKU extends ValueObject<SKUProps> {
  get value(): string { return this.props.value; }
  private constructor(props: SKUProps) { super(props); }
  public static create(value: string): SKU {
    if (!value || value.trim().length === 0) throw new Error('SKU cannot be empty');
    return new SKU({ value: value.trim().toUpperCase() });
  }
}