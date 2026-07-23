import { ValueObject } from '@saas/core';

export enum GRType {
  STANDARD = 'STANDARD',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface ReceiptTypeProps { value: GRType; }

export class ReceiptType extends ValueObject<ReceiptTypeProps> {
  get value(): GRType { return this.props.value; }
  private constructor(props: ReceiptTypeProps) { super(props); }
  public static create(value: GRType): ReceiptType {
    return new ReceiptType({ value });
  }
  public static standard(): ReceiptType { return new ReceiptType({ value: GRType.STANDARD }); }
}