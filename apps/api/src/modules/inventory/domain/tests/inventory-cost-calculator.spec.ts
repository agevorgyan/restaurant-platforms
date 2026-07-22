import { FIFOCostCalculator, WeightedAverageCostCalculator, MovingAverageCostCalculator } from '../services/inventory-cost.calculator';
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
import { Quantity } from '../value-objects/quantity.value-object';
import { UnitPrecision } from '../value-objects/unit-precision.value-object';
import { Money } from '../../../finance/domain/value-objects/money.value-object';
import { Currency } from '../../../finance/domain/value-objects/currency.value-object';
import { CurrencyCode } from '../../../finance/domain/value-objects/currency-code.enum';

describe('InventoryCostCalculator Strategies', () => {
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

  const createConsumeMovement = (seq: number, qty: number) => {
    return StockMovement.create({
      id: MovementId.create(),
      inventoryLedgerId: 'ledger1',
      sequence: LedgerSequence.create(seq),
      type: MovementType.create(MovementTypeEnum.CONSUME),
      status: MovementStatus.create(MovementStatusEnum.COMPLETED),
      quantity: MovementQuantity.create(Quantity.create(qty, precision)),
      actor: MovementActor.create({ id: 'actor1', movementId: 'mov', systemId: 'sys1' }),
      reason: MovementReasonEntity.create({ id: 'reason1', movementId: 'mov', code: 'SALE' }),
      occurredAt: new Date(),
    });
  };

  let ledger: InventoryLedger;

  beforeEach(() => {
    const movements = [
      createReceiveMovement(1, 10, 1000), // Received 10 units at $10.00
      createConsumeMovement(2, 5),        // Consumed 5 units
      createReceiveMovement(3, 10, 1500), // Received 10 units at $15.00
    ];

    ledger = InventoryLedger.create('ledger1', 'rest1', 'inv1', 'ing1');
    (ledger as any).props.movements = movements;
  });

  it('should calculate FIFO correctly', () => {
    const calc = new FIFOCostCalculator();
    const result = calc.calculate(ledger);
    
    // Remaining stock: 5 units at $10.00, 10 units at $15.00
    // Total value = 5*1000 + 10*1500 = 5000 + 15000 = 20000
    // Total units = 15
    // Blended Unit Cost = 20000 / 15 = 1333.33 -> 1333
    expect(result.unitCost.unitCost.amount.value).toBe(1333);
    expect(result.breakdown.layers.length).toBe(2);
    expect(result.breakdown.layers[0].quantity.value).toBe(5);
    expect(result.breakdown.layers[1].quantity.value).toBe(10);
  });

  it('should calculate Weighted Average correctly', () => {
    const calc = new WeightedAverageCostCalculator();
    const result = calc.calculate(ledger);
    
    // Historical receives: 10 units @ $10.00, 10 units @ $15.00
    // Total value = 10*1000 + 10*1500 = 25000
    // Total units = 20
    // Avg Cost = 25000 / 20 = 1250
    expect(result.unitCost.unitCost.amount.value).toBe(1250);
    expect(result.breakdown.layers.length).toBe(1);
    expect(result.breakdown.layers[0].quantity.value).toBe(20);
  });

  it('should calculate Moving Average correctly', () => {
    const calc = new MovingAverageCostCalculator();
    const result = calc.calculate(ledger);
    
    // Step 1: Recv 10 @ $10.00 -> Qty=10, Avg=1000, Total=10000
    // Step 2: Cons 5 -> Qty=5, Avg=1000, Total=5000
    // Step 3: Recv 10 @ $15.00 -> Qty=15, Total=5000 + 15000 = 20000, Avg = 20000 / 15 = 1333.33
    expect(result.unitCost.unitCost.amount.value).toBe(1333);
    expect(result.breakdown.layers.length).toBe(1);
    expect(result.breakdown.layers[0].quantity.value).toBe(15);
  });
});
