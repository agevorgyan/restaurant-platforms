import { Entity } from '@saas/core';

export enum TaxCategoryType {
  PRODUCT = 'PRODUCT',
  MENU_CATEGORY = 'MENU_CATEGORY',
  DELIVERY = 'DELIVERY',
  SERVICE_FEE = 'SERVICE_FEE',
  PACKAGING = 'PACKAGING',
  ENTIRE_ORDER = 'ENTIRE_ORDER',
}

export interface TaxCategoryProps {
  type: TaxCategoryType;
  value?: string; // The specific product ID or category ID, if applicable
}

export class TaxCategory extends Entity<TaxCategoryProps> {
  private constructor(id: string, props: TaxCategoryProps) {
    super(id, props);
  }

  public static create(id: string, props: TaxCategoryProps): TaxCategory {
    if (!Object.values(TaxCategoryType).includes(props.type)) {
      throw new Error(`Invalid category type: ${props.type}`);
    }
    return new TaxCategory(id, props);
  }

  get type(): TaxCategoryType {
    return this.props.type;
  }

  get value(): string | undefined {
    return this.props.value;
  }
}
