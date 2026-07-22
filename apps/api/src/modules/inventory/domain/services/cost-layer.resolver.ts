import { InventoryLedger } from '../aggregates/inventory-ledger.aggregate';
import { StockMovement } from '../entities/stock-movement.entity';
import { MovementTypeEnum } from '../value-objects/movement-type.value-object';
import { InventoryCost } from '../value-objects/inventory-cost.value-object';
import { CostLayer } from '../value-objects/cost-breakdown.value-object';
import { Quantity } from '../value-objects/quantity.value-object';

export class CostLayerResolver {
  /**
   * Resolves the active FIFO cost layers from a ledger.
   * It scans movements chronologically, adding to layers when receiving,
   * and depleting from the oldest layers when consuming/wasting.
   */
  public static resolveFIFOLayers(ledger: InventoryLedger): CostLayer[] {
    const activeLayers: { movement: StockMovement; remainingQty: number }[] = [];

    const sortedMovements = [...ledger.movements].sort((a, b) => a.sequence.value - b.sequence.value);

    for (const movement of sortedMovements) {
      const qty = movement.quantity.quantity.value;

      if (movement.type.value === MovementTypeEnum.RECEIVE) {
        if (!movement.costLayer) {
          throw new Error(`Receive movement ${movement.id} is missing a cost layer`);
        }
        activeLayers.push({ movement, remainingQty: qty });
      } else if (
        movement.type.value === MovementTypeEnum.CONSUME ||
        movement.type.value === MovementTypeEnum.WASTE
      ) {
        let qtyToDeplete = qty;
        
        while (qtyToDeplete > 0 && activeLayers.length > 0) {
          const oldestLayer = activeLayers[0];
          if (oldestLayer.remainingQty <= qtyToDeplete) {
            // Deplete entire layer
            qtyToDeplete -= oldestLayer.remainingQty;
            activeLayers.shift(); // Remove it
          } else {
            // Deplete partial layer
            oldestLayer.remainingQty -= qtyToDeplete;
            qtyToDeplete = 0;
          }
        }

        // We do not throw if qtyToDeplete > 0 here, because negative inventory 
        // might be allowed depending on policies, though it means we have untracked cost.
      }
    }

    // Convert active layers to CostLayer Value Objects
    return activeLayers.map(layer => ({
      movementId: layer.movement.id,
      quantity: Quantity.create(layer.remainingQty, layer.movement.quantity.quantity.precision),
      unitCost: InventoryCost.create(layer.movement.costLayer!.unitCost)
    }));
  }
}
