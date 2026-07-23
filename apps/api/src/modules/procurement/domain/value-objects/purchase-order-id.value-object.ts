import { ValueObject } from '@saas/core';

export interface PurchaseOrderIdProps {
  value: string;
}

export class PurchaseOrderId extends ValueObject<PurchaseOrderIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PurchaseOrderIdProps) {
    super(props);
  }

  public static create(value: string): PurchaseOrderId {
    if (!value || value.trim() === '') {
      throw new Error('PurchaseOrderId cannot be empty');
    }
    return new PurchaseOrderId({ value: value.trim() });
  }

  public static generate(): PurchaseOrderId {
    return new PurchaseOrderId({ value: crypto.randomUUID() });
  }
}
