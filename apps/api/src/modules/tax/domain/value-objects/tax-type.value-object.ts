import { ValueObject } from '@saas/core';

export enum TaxTypeEnum {
  VAT = 'VAT',
  SALES_TAX = 'SALES_TAX',
  SERVICE_TAX = 'SERVICE_TAX',
  CITY_TAX = 'CITY_TAX',
  DELIVERY_TAX = 'DELIVERY_TAX',
  ENVIRONMENTAL_FEE = 'ENVIRONMENTAL_FEE',
  CUSTOM = 'CUSTOM',
}

export interface TaxTypeProps {
  value: TaxTypeEnum;
}

export class TaxType extends ValueObject<TaxTypeProps> {
  private constructor(props: TaxTypeProps) {
    super(props);
  }

  public static create(value: TaxTypeEnum): TaxType {
    if (!Object.values(TaxTypeEnum).includes(value)) {
      throw new Error(`Invalid tax type: ${value}`);
    }
    return new TaxType({ value });
  }

  get value(): TaxTypeEnum {
    return this.props.value;
  }
}
