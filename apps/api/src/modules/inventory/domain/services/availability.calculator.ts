import { Inventory } from '../aggregates/inventory.aggregate';
import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { AvailabilitySnapshot } from '../value-objects/availability-snapshot.value-object';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { MovementStatusEnum } from '../value-objects/movement-status.value-object';
import { Quantity } from '../value-objects/quantity.value-object';
import { AvailabilityPolicy } from '../policies/availability.policy';

export class AvailabilityCalculator {
  /**
   * Calculates the projected availability considering current physical state (Inventory) 
   * and pending movements (InventoryLedger).
   */
  public static calculate(inventory: Inventory, ledger?: InventoryLedger): AvailabilitySnapshot {
    AvailabilityPolicy.validateAvailabilityCalculation(inventory, ledger);

    const precision = inventory.availableQuantity.quantity.precision;
    
    // Base states from authoritative Inventory aggregate
    const onHand = inventory.onHandQuantity.quantity.value;
    const reserved = inventory.reservedQuantity.quantity.value;
    const available = inventory.availableQuantity.quantity.value;

    let incoming = 0;
    let outgoing = 0;

    if (ledger) {
      for (const movement of ledger.movements) {
        if (movement.status.value === MovementStatusEnum.PENDING) {
          const qty = movement.quantity.quantity.value;
          
          switch (movement.type.value) {
            case MovementTypeEnum.RECEIVE:
            case MovementTypeEnum.TRANSFER_IN:
            case MovementTypeEnum.RETURN:
              incoming += qty;
              break;
            case MovementTypeEnum.CONSUME:
            case MovementTypeEnum.TRANSFER_OUT:
            case MovementTypeEnum.WASTE:
            case MovementTypeEnum.EXPIRATION:
            case MovementTypeEnum.PRODUCTION_CONSUMPTION:
              outgoing += qty;
              break;
          }
        }
      }
    }

    const projectedAvailable = available + incoming - outgoing;

    return AvailabilitySnapshot.create({
      inventoryId: inventory.id,
      onHand: Quantity.create(onHand, precision),
      reserved: Quantity.create(reserved, precision),
      available: Quantity.create(available, precision),
      incoming: Quantity.create(incoming, precision),
      outgoing: Quantity.create(outgoing, precision),
      projectedAvailable: Quantity.create(projectedAvailable, precision),
      calculatedAt: new Date(),
    });
  }
}
