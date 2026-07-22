import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { AvailabilityCalculator } from '../services/availability.calculator';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { StockMovement } from '../entities/stock-movement.entity';
import { MovementId } from '../value-objects/movement-id.value-object';
import { MovementType, MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { MovementStatus, MovementStatusEnum } from '../value-objects/movement-status.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { LedgerSequence } from '../value-objects/ledger-sequence.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { MovementActor } from '../entities/movement-actor.entity';
import { MovementReasonEntity } from '../entities/movement-reason.entity';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';
import { InventoryBatch } from '../entities/inventory-batch.entity';
import { BatchNumber } from '../value-objects/batch-number.value-object';
import { InventoryReservation } from '../entities/inventory-reservation.entity';
import { ReferenceId } from '../value-objects/reference-id.value-object';

describe('AvailabilityCalculator Domain Service', () => {
  const precision = UnitPrecision.create(2);
  const location = InventoryLocationEntity.create({ id: 'loc1', inventoryId: 'inv1' });

  it('should calculate projected available considering ledger pending movements', () => {
    // 1. Setup Inventory
    const inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    // Add batch (On Hand = 50, Available = 50)
    inventory.addBatch(InventoryBatch.create({
      id: 'batch1', inventoryId: 'inv1', batchNumber: BatchNumber.create('B1'), quantity: Quantity.create(50, precision)
    }));
    
    // Reserve 10 -> Available = 40, Reserved = 10
    inventory.addReservation(InventoryReservation.create({
      id: 'res1',
      inventoryId: 'inv1',
      orderReference: new ReferenceId('order1'),
      quantity: Quantity.create(10, precision),
      expirationTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
    }));

    // 2. Setup Ledger
    const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
    
    // Add Pending RECEIVE movement (Incoming = 20)
    const pendingReceive = StockMovement.create({
      id: MovementId.create(),
      inventoryLedgerId: 'ledger1',
      sequence: LedgerSequence.create(1),
      type: MovementType.create(MovementTypeEnum.RECEIVE),
      status: MovementStatus.create(MovementStatusEnum.PENDING),
      quantity: MovementQuantity.create(Quantity.create(20, precision)),
      actor: MovementActor.create({ id: 'actor1', movementId: 'mov1', systemId: 'sys' }),
      reason: MovementReasonEntity.create({ id: 'res1', movementId: 'mov1', code: 'PO' }),
      occurredAt: new Date(),
    });
    ledger.props.movements.push(pendingReceive); // bypass policy for test setup

    // Add Pending CONSUME movement (Outgoing = 5)
    const pendingConsume = StockMovement.create({
      id: MovementId.create(),
      inventoryLedgerId: 'ledger1',
      sequence: LedgerSequence.create(2),
      type: MovementType.create(MovementTypeEnum.CONSUME),
      status: MovementStatus.create(MovementStatusEnum.PENDING),
      quantity: MovementQuantity.create(Quantity.create(5, precision)),
      actor: MovementActor.create({ id: 'actor1', movementId: 'mov2', systemId: 'sys' }),
      reason: MovementReasonEntity.create({ id: 'res1', movementId: 'mov2', code: 'KIT' }),
      occurredAt: new Date(),
    });
    ledger.props.movements.push(pendingConsume); // bypass policy for test setup

    // 3. Calculate
    const snapshot = AvailabilityCalculator.calculate(inventory, ledger);

    expect(snapshot.onHand.value).toBe(50);
    expect(snapshot.reserved.value).toBe(10);
    expect(snapshot.available.value).toBe(40);
    expect(snapshot.incoming.value).toBe(20);
    expect(snapshot.outgoing.value).toBe(5);
    // Projected = Available(40) + Incoming(20) - Outgoing(5) = 55
    expect(snapshot.projectedAvailable.value).toBe(55);
  });
});
