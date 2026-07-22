import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { StockMovement } from '../entities/stock-movement.entity';
import { StockCostLayer, ValuationMethodEnum } from '../entities/stock-cost-layer.entity';
import { StockMovementReference } from '../entities/stock-movement-reference.entity';
import { MovementActor } from '../entities/movement-actor.entity';
import { MovementReasonEntity } from '../entities/movement-reason.entity';
import { MovementId } from '../value-objects/movement-id.value-object';
import { MovementType, MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { MovementStatus, MovementStatusEnum } from '../value-objects/movement-status.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { LedgerSequence } from '../value-objects/ledger-sequence.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';
import { 
  InventoryLedgerCreatedEvent, 
  StockReceivedEvent
} from '../events/inventory-ledger.events';

describe('InventoryLedger Aggregate', () => {
  const defaultPrecision = UnitPrecision.create(2);
  const createDefaultActor = () => MovementActor.create({
    id: 'actor1',
    movementId: 'mov1',
    userId: 'user1',
  });
  
  const createDefaultReason = () => MovementReasonEntity.create({
    id: 'reason1',
    movementId: 'mov1',
    code: 'RESTOCK',
  });

  describe('Creation', () => {
    it('should create an empty inventory ledger', () => {
      const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');

      expect(ledger.id).toBe('ledger1');
      expect(ledger.inventoryId).toBe('inv1');
      expect(ledger.movements.length).toBe(0);
      expect(ledger.currentSequence).toBe(0);

      const events = ledger.domainEvents;
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(InventoryLedgerCreatedEvent);
    });
  });

  describe('Appending Movements', () => {
    it('should append a receive movement and increment sequence', () => {
      const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
      ledger.clearEvents();

      const currency = Currency.create('USD' as any, 2);
      const unitCost = Money.create(10, currency);
      const totalCost = Money.create(100, currency);
      const costLayer = StockCostLayer.create({
        id: 'cost1',
        movementId: 'mov1',
        unitCost,
        totalCost,
        valuationMethod: ValuationMethodEnum.FIFO,
      });

      const reference = StockMovementReference.create({
        id: 'ref1',
        movementId: 'mov1',
        purchaseOrderId: new ReferenceId('PO-123'),
      });

      const movement = StockMovement.create({
        id: MovementId.create('mov1'),
        inventoryLedgerId: 'ledger1',
        sequence: LedgerSequence.create(1),
        type: MovementType.create(MovementTypeEnum.RECEIVE),
        status: MovementStatus.create(MovementStatusEnum.COMPLETED),
        quantity: MovementQuantity.create(Quantity.create(10, defaultPrecision)),
        actor: createDefaultActor(),
        reason: createDefaultReason(),
        costLayer,
        reference,
        occurredAt: new Date(),
      });

      ledger.appendMovement(movement);

      expect(ledger.movements.length).toBe(1);
      expect(ledger.currentSequence).toBe(1);

      const events = ledger.domainEvents;
      expect(events.some(e => e instanceof StockReceivedEvent)).toBe(true);
    });

    it('should reject appending a movement with a non-sequential sequence', () => {
      const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
      
      const movement1 = StockMovement.create({
        id: MovementId.create('mov1'),
        inventoryLedgerId: 'ledger1',
        sequence: LedgerSequence.create(2), // Should be 1
        type: MovementType.create(MovementTypeEnum.RESERVE),
        status: MovementStatus.create(MovementStatusEnum.PENDING),
        quantity: MovementQuantity.create(Quantity.create(5, defaultPrecision)),
        actor: createDefaultActor(),
        reason: createDefaultReason(),
        reference: StockMovementReference.create({
          id: 'ref1',
          movementId: 'mov1',
          orderId: new ReferenceId('ORD-1'),
        }),
        occurredAt: new Date(),
      });

      expect(() => ledger.appendMovement(movement1)).toThrow(/First ledger sequence must be 1/);
    });

    it('should reject a receive movement without a valid reference', () => {
      const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');

      const movement = StockMovement.create({
        id: MovementId.create('mov1'),
        inventoryLedgerId: 'ledger1',
        sequence: LedgerSequence.create(1),
        type: MovementType.create(MovementTypeEnum.RECEIVE),
        status: MovementStatus.create(MovementStatusEnum.COMPLETED),
        quantity: MovementQuantity.create(Quantity.create(10, defaultPrecision)),
        actor: createDefaultActor(),
        reason: createDefaultReason(),
        costLayer: StockCostLayer.create({
          id: 'cost1',
          movementId: 'mov1',
          unitCost: Money.create(10, Currency.create('USD' as any, 2)),
          totalCost: Money.create(100, Currency.create('USD' as any, 2)),
          valuationMethod: ValuationMethodEnum.FIFO,
        }),
        occurredAt: new Date(),
        // Missing purchaseOrderId reference!
      });

      expect(() => ledger.appendMovement(movement)).toThrow(/requires a purchase order or order reference/);
    });

    it('should reject duplicate movement IDs', () => {
      const ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
      
      const movement1 = StockMovement.create({
        id: MovementId.create('mov1'),
        inventoryLedgerId: 'ledger1',
        sequence: LedgerSequence.create(1),
        type: MovementType.create(MovementTypeEnum.RESERVE),
        status: MovementStatus.create(MovementStatusEnum.COMPLETED),
        quantity: MovementQuantity.create(Quantity.create(5, defaultPrecision)),
        actor: createDefaultActor(),
        reason: createDefaultReason(),
        reference: StockMovementReference.create({
          id: 'ref1',
          movementId: 'mov1',
          orderId: new ReferenceId('ORD-1'),
        }),
        occurredAt: new Date(),
      });

      const movement2 = StockMovement.create({
        id: MovementId.create('mov1'), // Duplicate ID!
        inventoryLedgerId: 'ledger1',
        sequence: LedgerSequence.create(2),
        type: MovementType.create(MovementTypeEnum.RELEASE_RESERVATION),
        status: MovementStatus.create(MovementStatusEnum.COMPLETED),
        quantity: MovementQuantity.create(Quantity.create(5, defaultPrecision)),
        actor: createDefaultActor(),
        reason: createDefaultReason(),
        reference: StockMovementReference.create({
          id: 'ref2',
          movementId: 'mov2',
          orderId: new ReferenceId('ORD-1'),
        }),
        occurredAt: new Date(),
      });

      ledger.appendMovement(movement1);
      expect(() => ledger.appendMovement(movement2)).toThrow(/Duplicate movement ID detected/);
    });
  });
});
