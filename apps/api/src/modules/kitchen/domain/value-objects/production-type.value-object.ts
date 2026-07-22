import { ValueObject } from '@saas/core';
import { ProductionType as ProductionTypeEnum } from '../enums/production-type.enum';

export interface ProductionTypeProps {
  value: ProductionTypeEnum;
}

export class ProductionType extends ValueObject<ProductionTypeProps> {
  get value(): ProductionTypeEnum {
    return this.props.value;
  }

  private constructor(props: ProductionTypeProps) {
    super(props);
  }

  public static create(value: ProductionTypeEnum): ProductionType {
    return new ProductionType({ value });
  }
}
