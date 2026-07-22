import { InventoryValuationService } from '../services/inventory-valuation.service';
import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { StockMovement } from '../entities/stock-movement.entity';
import { MovementId } from '../value-objects/movement-id.value-object';
import { MovementType, MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { LedgerSequence } from '../value-objects/ledger-sequence.value-object';
import { MovementStatus, MovementStatusEnum } from '../value-objects/movement-status.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { MovementActor } from '../entities/movement-actor.entity';
import { MovementReasonEntity } from '../entities/movement-reason.entity';
import { StockCostLayer, ValuationMethodEnum as CostLayerValuationMethodEnum } from '../entities/stock-cost-layer.entity';
import { ValuationMethodEnum } from '../value-objects/valuation-method.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { OnHandQuantity } from '../value-objects/on-hand-quantity.value-object';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';
import { InventoryLocationEntity } from '../entities/inventory-location.entity';

describe('InventoryValuationService', () => {
  const precision = UnitPrecision.create(2);
  const usd = Currency.create(CurrencyCode.USD, 2);

  const createReceiveMovement = (seq: number, qty: number, unitCost: number) => {
    return StockMovement.create({
      id: MovementId.create(),
      inventoryLedgerId: 'ledger1',
      sequence: LedgerSequence.create(seq),
      type: MovementType.create(MovementTypeEnum.RECEIVE),
      status: MovementStatus.create(MovementStatusEnum.COMPLETED),
      quantity: MovementQuantity.create(Quantity.create(qty, precision)),
      actor: MovementActor.create({ id: 'actor1', movementId: 'mov', systemId: 'sys1' }),
      reason: MovementReasonEntity.create({ id: 'reason1', movementId: 'mov', code: 'PO' }),
      occurredAt: new Date(),
      costLayer: StockCostLayer.create({
        id: 'layer1',
        movementId: 'mov',
        unitCost: Money.create(unitCost, usd),
        totalCost: Money.create(unitCost * qty, usd),
        valuationMethod: CostLayerValuationMethodEnum.FIFO,
      })
    });
  };

  let ledger: InventoryLedger;
  let inventory: Inventory;

  beforeEach(() => {
    const movements = [
      createReceiveMovement(1, 10, 1000), // Received 10 units at $10.00
      createReceiveMovement(2, 10, 1500), // Received 10 units at $15.00
    ];

    ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
    (ledger as any).props.movements = movements;

    const location = InventoryLocationEntity.create({
      id: 'loc1',
      inventoryId: 'inv1',
      shelf: 'SHELF_1'
    });

    inventory = Inventory.create('inv1', 'rest1', 'ing1', location, precision);
    
    // Simulate stock
    (inventory as any).props.onHandQuantity = OnHandQuantity.create(Quantity.create(20, precision));
  });

  it('should calculate full valuation snapshot and emit events', () => {
    const { snapshot, events } = InventoryValuationService.calculateValuation(
      inventory,
      ledger,
      ValuationMethodEnum.FIFO
    );

    // Total units = 20. Total Value = 10*1000 + 10*1500 = 25000.
    // Unit Cost = 25000 / 20 = 1250
    expect(snapshot.method.value).toBe(ValuationMethodEnum.FIFO);
    expect(snapshot.totalValue.totalValue.amount.value).toBe(25000);
    expect(snapshot.unitCost.unitCost.amount.value).toBe(1250);
    expect(snapshot.breakdown.layers.length).toBe(2);
    
    expect(events.length).toBe(3);
    expect(events[0].constructor.name).toBe('InventoryValuationCalculatedEvent');
    expect(events[1].constructor.name).toBe('InventoryCostCalculatedEvent');
    expect(events[2].constructor.name).toBe('CostSnapshotCreatedEvent');
  });

  it('should validate missing layers correctly', () => {
    const emptyLedger = InventoryLedger.create('ledger2', 'rest1', 'inv1', 'ing1');

    expect(() => {
      InventoryValuationService.calculateValuation(inventory, emptyLedger, ValuationMethodEnum.FIFO);
    }).toThrow('no historical receive movements');
  });
});
