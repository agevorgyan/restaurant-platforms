import { ValueObject } from '@saas/core';

export interface BarcodeProps { value: string; }

export class Barcode extends ValueObject<BarcodeProps> {
  get value(): string { return this.props.value; }
  private constructor(props: BarcodeProps) { super(props); }
  public static create(value: string): Barcode {
    return new Barcode({ value: value.trim() });
  }
}