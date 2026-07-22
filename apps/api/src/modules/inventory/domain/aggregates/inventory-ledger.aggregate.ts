import { AggregateRoot, DomainEvent } from '@saas/core';
import { StockMovement } from '../entities/stock-movement.entity';
import { LedgerVersion } from '../value-objects/ledger-version.value-object';

import { MovementCreationPolicy } from '../policies/movement-creation.policy';
import { LedgerAppendPolicy } from '../policies/ledger-append.policy';
import { CostLayerPolicy } from '../policies/cost-layer.policy';
import {
  InventoryLedgerCreatedEvent,
  StockReceivedEvent,
  StockConsumedEvent,
  ReservationRecordedEvent,
  ReservationReleasedEvent,
  WasteRecordedEvent,
  StockAdjustedEvent,
  StockTransferredEvent,
  StockReturnedEvent,
  StockExpiredEvent,
} from '../events/inventory-ledger.events';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';

export interface InventoryLedgerProps {
  id: string;
  restaurantId: string;
  inventoryId: string;
  ingredientId: string;
  movements: StockMovement[];
  version: LedgerVersion;
  createdAt: Date;
  updatedAt: Date;
}

export class InventoryLedger extends AggregateRoot<InventoryLedgerProps> {
  get id(): string {
    return this._id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get inventoryId(): string {
    return this.props.inventoryId;
  }

  get ingredientId(): string {
    return this.props.ingredientId;
  }

  get movements(): StockMovement[] {
    // Return a copy to prevent direct mutation
    return [...this.props.movements];
  }

  get version(): LedgerVersion {
    return this.props.version;
  }

  get currentSequence(): number {
    if (this.props.movements.length === 0) {
      return 0;
    }
    return this.props.movements[this.props.movements.length - 1].sequence.value;
  }

  private constructor(id: string, props: InventoryLedgerProps) {
    super(id, props);
  }

  public static create(id: string, restaurantId: string, inventoryId: string, ingredientId: string): InventoryLedger {
    const ledger = new InventoryLedger(id, {
      id,
      restaurantId,
      inventoryId,
      ingredientId,
      movements: [],
      version: LedgerVersion.create(1),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    ledger.addDomainEvent(
      new InventoryLedgerCreatedEvent(id, restaurantId, inventoryId, ingredientId)
    );

    return ledger;
  }

  public appendMovement(movement: StockMovement): void {
    // 1. Validate movement creation invariants
    MovementCreationPolicy.validateCreation(movement);

    // 2. Validate cost layer invariants
    CostLayerPolicy.validateCostLayer(movement);

    // 3. Validate ledger append invariants (sequence, no duplicates, status)
    LedgerAppendPolicy.validateAppend(this.props.movements, movement);

    // 4. Append movement
    this.props.movements.push(movement);

    // 5. Emit Domain Event based on MovementType
    this.emitMovementEvent(movement);

    // 6. Increment version
    this.incrementVersion();
  }

  private emitMovementEvent(movement: StockMovement): void {
    let event: DomainEvent | undefined;

    switch (movement.type.value) {
      case MovementTypeEnum.RECEIVE:
        event = new StockReceivedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.CONSUME:
      case MovementTypeEnum.PRODUCTION_CONSUMPTION:
        event = new StockConsumedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.RESERVE:
        event = new ReservationRecordedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.RELEASE_RESERVATION:
        event = new ReservationReleasedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.WASTE:
        event = new WasteRecordedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.ADJUSTMENT:
      case MovementTypeEnum.CYCLE_COUNT_CORRECTION:
        event = new StockAdjustedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.TRANSFER_IN:
      case MovementTypeEnum.TRANSFER_OUT:
        event = new StockTransferredEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.RETURN:
        event = new StockReturnedEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
      case MovementTypeEnum.EXPIRATION:
        event = new StockExpiredEvent(this.id, this.restaurantId, movement.id, movement.quantity.quantity.value);
        break;
    }

    if (event) {
      this.addDomainEvent(event);
    }
  }

  private incrementVersion(): void {
    this.props.version = LedgerVersion.create(this.props.version.value + 1);
    this.props.updatedAt = new Date();
  }
}
