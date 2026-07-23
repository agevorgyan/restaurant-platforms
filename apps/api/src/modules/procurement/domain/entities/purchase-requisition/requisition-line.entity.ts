import { Entity } from '@saas/core';
import { MoneyReference } from '../../value-objects/money-reference.value-object';
import { SupplierId } from '../../value-objects/supplier-id.value-object';

export interface RequisitionLineProps {
  productId?: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedUnitPrice?: MoneyReference;
  suggestedSupplierId?: SupplierId;
}

export class RequisitionLine extends Entity<RequisitionLineProps> {
  get productId(): string | undefined { return this.props.productId; }
  get description(): string { return this.props.description; }
  get quantity(): number { return this.props.quantity; }
  get unitOfMeasure(): string { return this.props.unitOfMeasure; }
  get estimatedUnitPrice(): MoneyReference | undefined { return this.props.estimatedUnitPrice; }
  get suggestedSupplierId(): SupplierId | undefined { return this.props.suggestedSupplierId; }

  private constructor(id: string, props: RequisitionLineProps) {
    super(id, props);
  }

  public static create(props: RequisitionLineProps, id?: string): RequisitionLine {
    if (props.quantity <= 0) {
      throw new Error('Requisition line quantity must be positive');
    }
    if (!props.description || props.description.trim() === '') {
      throw new Error('Requisition line must have a description');
    }
    if (!props.unitOfMeasure || props.unitOfMeasure.trim() === '') {
      throw new Error('Requisition line must have a unit of measure');
    }

    return new RequisitionLine(id || crypto.randomUUID(), props);
  }

  public getEstimatedTotal(): number {
    if (!this.props.estimatedUnitPrice) return 0;
    return this.props.quantity * this.props.estimatedUnitPrice.amount;
  }
}
