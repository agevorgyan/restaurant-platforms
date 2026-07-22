import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';
import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { ProductionConsistencySpecification } from '../specifications/production.specification';

export class ProductionExecutionPolicy {
  public static canStartExecution(status: ProductionStatusEnum): boolean {
    return status === ProductionStatusEnum.SCHEDULED || status === ProductionStatusEnum.PAUSED;
  }

  public static canPauseExecution(status: ProductionStatusEnum): boolean {
    return status === ProductionStatusEnum.IN_PROGRESS;
  }

  public static canCompleteExecution(status: ProductionStatusEnum): boolean {
    return status === ProductionStatusEnum.IN_PROGRESS;
  }
}

export class ProductionValidationPolicy {
  public static validate(ingredients: ProductionIngredient[]): void {
    if (!ProductionConsistencySpecification.isSatisfiedBy(ingredients)) {
      throw new Error('Production must have at least one valid ingredient with no duplicates');
    }
  }
}
