import { Entity } from '@saas/core';

export enum TaxJurisdictionType {
  COUNTRY = 'COUNTRY',
  REGION = 'REGION',
  CITY = 'CITY',
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
}

export interface TaxJurisdictionProps {
  type: TaxJurisdictionType;
  value: string; // The ID or code of the country, region, city, restaurant, or branch
}

export class TaxJurisdiction extends Entity<TaxJurisdictionProps> {
  private constructor(id: string, props: TaxJurisdictionProps) {
    super(id, props);
  }

  public static create(id: string, props: TaxJurisdictionProps): TaxJurisdiction {
    if (!Object.values(TaxJurisdictionType).includes(props.type)) {
      throw new Error(`Invalid jurisdiction type: ${props.type}`);
    }
    if (!props.value || props.value.trim().length === 0) {
      throw new Error('Jurisdiction value cannot be empty');
    }
    return new TaxJurisdiction(id, props);
  }

  get type(): TaxJurisdictionType {
    return this.props.type;
  }

  get value(): string {
    return this.props.value;
  }
}
