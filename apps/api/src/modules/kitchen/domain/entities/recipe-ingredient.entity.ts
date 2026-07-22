import { Entity } from '@saas/core';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitOfMeasureEnum } from '../../../inventory/domain/value-objects/unit-of-measure.value-object';

export interface RecipeIngredientProps {
  id: string;
  ingredient: IngredientReference;
  quantity: Quantity;
  unit: UnitOfMeasureEnum;
  isOptional: boolean;
  wastePercentage: number;
  preparationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeIngredient extends Entity<RecipeIngredientProps> {
  get id(): string {
    return this._id;
  }

  get ingredient(): IngredientReference {
    return this.props.ingredient;
  }

  get quantity(): Quantity {
    return this.props.quantity;
  }

  get unit(): UnitOfMeasureEnum {
    return this.props.unit;
  }

  get isOptional(): boolean {
    return this.props.isOptional;
  }

  get wastePercentage(): number {
    return this.props.wastePercentage;
  }

  get preparationNote(): string | undefined {
    return this.props.preparationNote;
  }

  private constructor(id: string, props: RecipeIngredientProps) {
    super(id, props);
  }

  public static create(
    id: string,
    ingredient: IngredientReference,
    quantity: Quantity,
    unit: UnitOfMeasureEnum,
    isOptional: boolean = false,
    wastePercentage: number = 0,
    preparationNote?: string
  ): RecipeIngredient {
    if (quantity.value <= 0) {
      throw new Error('Ingredient quantity must be greater than zero');
    }
    if (wastePercentage < 0 || wastePercentage > 100) {
      throw new Error('Waste percentage must be between 0 and 100');
    }

    return new RecipeIngredient(id, {
      id,
      ingredient,
      quantity,
      unit,
      isOptional,
      wastePercentage,
      preparationNote,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
