import { ValueObject } from '@saas/core';
import { Quantity } from './quantity.value-object';
import { InventoryCost } from './inventory-cost.value-object';

export interface CostLayer {
  batchId?: string;
  movementId?: string;
  quantity: Quantity;
  unitCost: InventoryCost;
}

export interface CostBreakdownProps {
  layers: CostLayer[];
}

/**
 * Represents the detailed breakdown of how a total cost was calculated,
 * mapping quantities to specific cost layers (batches or moving average layers).
 */
export class CostBreakdown extends ValueObject<CostBreakdownProps> {
  private constructor(props: CostBreakdownProps) {
    super(props);
  }

  public static create(layers: CostLayer[]): CostBreakdown {
    // Validate no negative quantities or costs in layers
    for (const layer of layers) {
      if (layer.quantity.value < 0) {
        throw new Error('Cost layer quantity cannot be negative');
      }
    }

    // Freeze layers to enforce immutability
    return new CostBreakdown({ layers: [...layers] });
  }

  get layers(): ReadonlyArray<CostLayer> {
    return Object.freeze([...this.props.layers]);
  }
}
