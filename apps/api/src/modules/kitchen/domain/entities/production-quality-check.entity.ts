import { Entity } from '@saas/core';
import { ProductionQualityStatus } from '../enums/production-quality-status.enum';

export interface ProductionQualityCheckProps {
  id: string;
  status: ProductionQualityStatus;
  inspectorId: string;
  remarks?: string;
  checkedAt: Date;
}

export class ProductionQualityCheck extends Entity<ProductionQualityCheckProps> {
  get id(): string {
    return this._id;
  }

  get status(): ProductionQualityStatus {
    return this.props.status;
  }

  get inspectorId(): string {
    return this.props.inspectorId;
  }

  get remarks(): string | undefined {
    return this.props.remarks;
  }

  get checkedAt(): Date {
    return this.props.checkedAt;
  }

  private constructor(id: string, props: ProductionQualityCheckProps) {
    super(id, props);
  }

  public static create(
    id: string,
    status: ProductionQualityStatus,
    inspectorId: string,
    remarks?: string
  ): ProductionQualityCheck {
    if (!inspectorId || inspectorId.trim() === '') {
      throw new Error('Inspector ID cannot be empty');
    }

    return new ProductionQualityCheck(id, {
      id,
      status,
      inspectorId: inspectorId.trim(),
      remarks,
      checkedAt: new Date()
    });
  }
}
