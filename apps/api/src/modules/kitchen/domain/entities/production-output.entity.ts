import { Entity } from '@saas/core';
import { FinishedProductReference } from '../value-objects/finished-product-reference.value-object';
import { ProducedQuantity } from '../value-objects/produced-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionQualityStatus } from '../enums/production-quality-status.enum';

export interface ProductionOutputProps {
  id: string;
  finishedProductReference: FinishedProductReference;
  producedQuantity: ProducedQuantity;
  rejectedQuantity: Quantity;
  qualityStatus: ProductionQualityStatus;
}

export class ProductionOutput extends Entity<ProductionOutputProps> {
  get id(): string {
    return this._id;
  }

  get finishedProductReference(): FinishedProductReference {
    return this.props.finishedProductReference;
  }

  get producedQuantity(): ProducedQuantity {
    return this.props.producedQuantity;
  }

  get rejectedQuantity(): Quantity {
    return this.props.rejectedQuantity;
  }

  get qualityStatus(): ProductionQualityStatus {
    return this.props.qualityStatus;
  }

  private constructor(id: string, props: ProductionOutputProps) {
    super(id, props);
  }

  public static create(
    id: string,
    finishedProductReference: FinishedProductReference,
    producedQuantity: ProducedQuantity
  ): ProductionOutput {
    return new ProductionOutput(id, {
      id,
      finishedProductReference,
      producedQuantity,
      rejectedQuantity: Quantity.create(0, UnitPrecision.create(0)),
      qualityStatus: ProductionQualityStatus.PENDING_INSPECTION
    });
  }

  public rejectQuantity(quantity: Quantity): void {
    if (quantity.value < 0) {
      throw new Error('Rejected quantity cannot be negative');
    }
    this.props.rejectedQuantity = Quantity.create(
      this.props.rejectedQuantity.value + quantity.value,
      UnitPrecision.create(0)
    );
  }

  public updateQualityStatus(status: ProductionQualityStatus): void {
    this.props.qualityStatus = status;
  }
}
