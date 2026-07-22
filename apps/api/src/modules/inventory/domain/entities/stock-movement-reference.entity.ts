import { Entity } from '@saas/core';
import { ReferenceId } from '../value-objects/reference-id.value-object';

export interface StockMovementReferenceProps {
  id: string;
  movementId: string;
  orderId?: ReferenceId;
  purchaseOrderId?: ReferenceId;
  kitchenTicketId?: ReferenceId;
  batchId?: ReferenceId;
}

export class StockMovementReference extends Entity<StockMovementReferenceProps> {
  get id(): string {
    return this._id;
  }

  get movementId(): string {
    return this.props.movementId;
  }

  get orderId(): ReferenceId | undefined {
    return this.props.orderId;
  }

  get purchaseOrderId(): ReferenceId | undefined {
    return this.props.purchaseOrderId;
  }

  get kitchenTicketId(): ReferenceId | undefined {
    return this.props.kitchenTicketId;
  }

  get batchId(): ReferenceId | undefined {
    return this.props.batchId;
  }

  private constructor(id: string, props: StockMovementReferenceProps) {
    super(id, props);
  }

  public static create(props: StockMovementReferenceProps): StockMovementReference {
    return new StockMovementReference(props.id, props);
  }
}
