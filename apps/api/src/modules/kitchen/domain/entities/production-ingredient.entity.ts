import { Entity } from '@saas/core';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';

export interface ProductionIngredientProps {
  id: string;
  ingredientReference: IngredientReference;
  plannedQuantity: PlannedQuantity;
  consumedQuantity: Quantity;
  wasteQuantity: Quantity;
}

export class ProductionIngredient extends Entity<ProductionIngredientProps> {
  get id(): string {
    return this._id;
  }

  get ingredientReference(): IngredientReference {
    return this.props.ingredientReference;
  }

  get plannedQuantity(): PlannedQuantity {
    return this.props.plannedQuantity;
  }

  get consumedQuantity(): Quantity {
    return this.props.consumedQuantity;
  }

  get wasteQuantity(): Quantity {
    return this.props.wasteQuantity;
  }

  private constructor(id: string, props: ProductionIngredientProps) {
    super(id, props);
  }

  public static create(
    id: string,
    ingredientReference: IngredientReference,
    plannedQuantity: PlannedQuantity
  ): ProductionIngredient {
    return new ProductionIngredient(id, {
      id,
      ingredientReference,
      plannedQuantity,
      consumedQuantity: Quantity.create(0, UnitPrecision.create(2)),
      wasteQuantity: Quantity.create(0, UnitPrecision.create(2))
    });
  }

  public consume(quantity: Quantity): void {
    if (quantity.value < 0) {
      throw new Error('Consumed quantity cannot be negative');
    }
    this.props.consumedQuantity = Quantity.create(
      this.props.consumedQuantity.value + quantity.value,
      UnitPrecision.create(2)
    );
  }

  public recordWaste(quantity: Quantity): void {
    if (quantity.value < 0) {
      throw new Error('Waste quantity cannot be negative');
    }
    this.props.wasteQuantity = Quantity.create(
      this.props.wasteQuantity.value + quantity.value,
      UnitPrecision.create(2)
    );
  }
}
