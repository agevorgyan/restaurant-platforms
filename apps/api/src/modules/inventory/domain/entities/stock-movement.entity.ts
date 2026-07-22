import { Entity } from '@saas/core';
import { MovementId } from '../value-objects/movement-id.value-object';
import { MovementType } from '../value-objects/movement-type.value-object';
import { MovementStatus } from '../value-objects/movement-status.value-object';
import { MovementSource } from '../value-objects/movement-source.value-object';
import { MovementDestination } from '../value-objects/movement-destination.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { LedgerSequence } from '../value-objects/ledger-sequence.value-object';
import { StockCostLayer } from './stock-cost-layer.entity';
import { StockMovementReference } from './stock-movement-reference.entity';
import { MovementActor } from './movement-actor.entity';
import { MovementReasonEntity } from './movement-reason.entity';

export interface StockMovementProps {
  id: MovementId;
  inventoryLedgerId: string;
  sequence: LedgerSequence;
  type: MovementType;
  status: MovementStatus;
  quantity: MovementQuantity;
  source?: MovementSource;
  destination?: MovementDestination;
  reference?: StockMovementReference;
  costLayer?: StockCostLayer;
  actor: MovementActor;
  reason: MovementReasonEntity;
  occurredAt: Date;
}

export class StockMovement extends Entity<StockMovementProps> {
  get id(): string {
    return this.props.id.value;
  }

  get movementId(): MovementId {
    return this.props.id;
  }

  get inventoryLedgerId(): string {
    return this.props.inventoryLedgerId;
  }

  get sequence(): LedgerSequence {
    return this.props.sequence;
  }

  get type(): MovementType {
    return this.props.type;
  }

  get status(): MovementStatus {
    return this.props.status;
  }

  get quantity(): MovementQuantity {
    return this.props.quantity;
  }

  get source(): MovementSource | undefined {
    return this.props.source;
  }

  get destination(): MovementDestination | undefined {
    return this.props.destination;
  }

  get reference(): StockMovementReference | undefined {
    return this.props.reference;
  }

  get costLayer(): StockCostLayer | undefined {
    return this.props.costLayer;
  }

  get actor(): MovementActor {
    return this.props.actor;
  }

  get reason(): MovementReasonEntity {
    return this.props.reason;
  }

  get occurredAt(): Date {
    return this.props.occurredAt;
  }

  private constructor(id: string, props: StockMovementProps) {
    super(id, props);
  }

  public static create(props: StockMovementProps): StockMovement {
    return new StockMovement(props.id.value, props);
  }
}
