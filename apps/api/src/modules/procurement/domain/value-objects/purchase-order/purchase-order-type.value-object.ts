import { ValueObject } from '@saas/core';

export enum POType {
  STANDARD = 'STANDARD',
  BLANKET = 'BLANKET',
  CONTRACT = 'CONTRACT'
}

export interface PurchaseOrderTypeProps { value: POType; }

export class PurchaseOrderType extends ValueObject<PurchaseOrderTypeProps> {
  get value(): POType { return this.props.value; }
  private constructor(props: PurchaseOrderTypeProps) { super(props); }
  public static create(value: POType): PurchaseOrderType {
    return new PurchaseOrderType({ value });
  }
  public static standard(): PurchaseOrderType { return new PurchaseOrderType({ value: POType.STANDARD }); }
}