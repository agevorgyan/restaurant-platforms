import { ValueObject } from '@saas/core';

export interface PurchaseRequisitionIdProps {
  value: string;
}

export class PurchaseRequisitionId extends ValueObject<PurchaseRequisitionIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PurchaseRequisitionIdProps) {
    super(props);
  }

  public static create(value: string): PurchaseRequisitionId {
    if (!value || value.trim() === '') {
      throw new Error('PurchaseRequisitionId cannot be empty');
    }
    return new PurchaseRequisitionId({ value: value.trim() });
  }

  public static generate(): PurchaseRequisitionId {
    return new PurchaseRequisitionId({ value: crypto.randomUUID() });
  }
}
