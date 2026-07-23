import { ValueObject } from '@saas/core';

export interface PurchaseRequisitionNumberProps {
  value: string;
}

export class PurchaseRequisitionNumber extends ValueObject<PurchaseRequisitionNumberProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PurchaseRequisitionNumberProps) {
    super(props);
  }

  public static create(value: string): PurchaseRequisitionNumber {
    if (!value || value.trim() === '') {
      throw new Error('PurchaseRequisitionNumber cannot be empty');
    }
    return new PurchaseRequisitionNumber({ value: value.trim().toUpperCase() });
  }

  public static generate(): PurchaseRequisitionNumber {
    // In a real system, this might use a sequence generator
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    return new PurchaseRequisitionNumber({ value: `PR-${randomSuffix}` });
  }
}
