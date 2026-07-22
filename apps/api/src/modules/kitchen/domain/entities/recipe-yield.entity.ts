import { Entity } from '@saas/core';
import { RecipeYieldQuantity } from '../value-objects/recipe-yield-quantity.value-object';
import { PortionSize } from '../value-objects/portion-size.value-object';

export enum YieldType {
  SINGLE_PORTION = 'SINGLE_PORTION',
  MULTIPLE_PORTIONS = 'MULTIPLE_PORTIONS',
  BATCH = 'BATCH',
}

export interface RecipeYieldProps {
  id: string;
  yieldType: YieldType;
  quantity: RecipeYieldQuantity;
  portionSize?: PortionSize;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeYield extends Entity<RecipeYieldProps> {
  get id(): string {
    return this._id;
  }

  get yieldType(): YieldType {
    return this.props.yieldType;
  }

  get quantity(): RecipeYieldQuantity {
    return this.props.quantity;
  }

  get portionSize(): PortionSize | undefined {
    return this.props.portionSize;
  }

  private constructor(id: string, props: RecipeYieldProps) {
    super(id, props);
  }

  public static create(
    id: string,
    yieldType: YieldType,
    quantity: RecipeYieldQuantity,
    portionSize?: PortionSize
  ): RecipeYield {
    if (yieldType === YieldType.SINGLE_PORTION && quantity.value !== 1) {
      throw new Error('Single portion yield must have a quantity of 1');
    }
    if ((yieldType === YieldType.SINGLE_PORTION || yieldType === YieldType.MULTIPLE_PORTIONS) && !portionSize) {
      throw new Error('Portion size must be defined for portion-based yields');
    }

    return new RecipeYield(id, {
      id,
      yieldType,
      quantity,
      portionSize,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
