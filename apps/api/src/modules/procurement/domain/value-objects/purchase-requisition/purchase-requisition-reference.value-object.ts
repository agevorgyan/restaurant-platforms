import { ValueObject } from '@saas/core';

export interface PurchaseRequisitionReferenceProps {
  value: string;
}

export class PurchaseRequisitionReference extends ValueObject<PurchaseRequisitionReferenceProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PurchaseRequisitionReferenceProps) {
    super(props);
  }

  public static create(value: string): PurchaseRequisitionReference {
    if (!value || value.trim() === '') {
      throw new Error('PurchaseRequisitionReference cannot be empty');
    }
    return new PurchaseRequisitionReference({ value: value.trim() });
  }
}
