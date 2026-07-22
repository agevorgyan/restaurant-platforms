import { ValueObject } from '@saas/core';
import { ProductionPriority as ProductionPriorityEnum } from '../enums/production-priority.enum';

export interface ProductionPriorityProps {
  value: ProductionPriorityEnum;
}

export class ProductionPriority extends ValueObject<ProductionPriorityProps> {
  get value(): ProductionPriorityEnum {
    return this.props.value;
  }

  private constructor(props: ProductionPriorityProps) {
    super(props);
  }

  public static create(value: ProductionPriorityEnum): ProductionPriority {
    return new ProductionPriority({ value });
  }

  public isRush(): boolean {
    return this.props.value === ProductionPriorityEnum.RUSH;
  }
}
