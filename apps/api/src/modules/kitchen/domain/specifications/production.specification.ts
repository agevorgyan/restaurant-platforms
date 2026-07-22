import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';

export class ProductionIngredientSpecification {
  public static isSatisfiedBy(
    ingredients: ProductionIngredient[],
    newIngredient: ProductionIngredient
  ): boolean {
    const exists = ingredients.some(
      (ing) => ing.ingredientReference.externalId === newIngredient.ingredientReference.externalId
    );
    return !exists;
  }
}

export class ProductionConsistencySpecification {
  public static isSatisfiedBy(ingredients: ProductionIngredient[]): boolean {
    if (ingredients.length === 0) {
      return false; // A production must have ingredients
    }

    const itemIds = ingredients.map((i) => i.ingredientReference.externalId);
    const uniqueIds = new Set(itemIds);
    return uniqueIds.size === itemIds.length;
  }
}

export class ProductionLifecycleSpecification {
  public static canTransition(
    currentStatus: ProductionStatusEnum,
    newStatus: ProductionStatusEnum
  ): boolean {
    if (currentStatus === ProductionStatusEnum.COMPLETED || currentStatus === ProductionStatusEnum.CANCELLED) {
      return false;
    }

    switch (currentStatus) {
      case ProductionStatusEnum.PLANNED:
        return [ProductionStatusEnum.SCHEDULED, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.SCHEDULED:
        return [ProductionStatusEnum.IN_PROGRESS, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.IN_PROGRESS:
        return [ProductionStatusEnum.PAUSED, ProductionStatusEnum.COMPLETED, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.PAUSED:
        return [ProductionStatusEnum.IN_PROGRESS, ProductionStatusEnum.CANCELLED].includes(newStatus);
      default:
        return false;
    }
  }
}
