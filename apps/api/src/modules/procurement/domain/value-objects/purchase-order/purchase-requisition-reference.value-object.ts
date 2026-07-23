import { ValueObject } from '@saas/core';

export interface PurchaseRequisitionReferenceProps { requisitionId: string; }

export class PurchaseRequisitionReference extends ValueObject<PurchaseRequisitionReferenceProps> {
  get requisitionId(): string { return this.props.requisitionId; }
  private constructor(props: PurchaseRequisitionReferenceProps) { super(props); }
  public static create(requisitionId: string): PurchaseRequisitionReference {
    if (!requisitionId) throw new Error('PurchaseRequisitionReference cannot be empty');
    return new PurchaseRequisitionReference({ requisitionId });
  }
}