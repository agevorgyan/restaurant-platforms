import { ValueObject } from '@saas/core';

export interface ProcurementReferenceProps {
  referenceNumber: string;
}

export class ProcurementReference extends ValueObject<ProcurementReferenceProps> {
  get referenceNumber(): string {
    return this.props.referenceNumber;
  }

  private constructor(props: ProcurementReferenceProps) {
    super(props);
  }

  public static create(referenceNumber: string): ProcurementReference {
    if (!referenceNumber || referenceNumber.trim() === '') {
      throw new Error('ProcurementReference cannot be empty');
    }
    return new ProcurementReference({ referenceNumber: referenceNumber.trim() });
  }
}
