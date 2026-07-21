import { Entity } from '@saas/core';

export enum TaxExemptionType {
  CUSTOMER = 'CUSTOMER',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  RESTAURANT = 'RESTAURANT',
}

export interface TaxExemptionProps {
  type: TaxExemptionType;
  value: string; // The specific ID of the customer, product, category, or restaurant
  reason: string;
}

export class TaxExemption extends Entity<TaxExemptionProps> {
  private constructor(id: string, props: TaxExemptionProps) {
    super(id, props);
  }

  public static create(id: string, props: TaxExemptionProps): TaxExemption {
    if (!Object.values(TaxExemptionType).includes(props.type)) {
      throw new Error(`Invalid exemption type: ${props.type}`);
    }
    if (!props.value || props.value.trim().length === 0) {
      throw new Error('Exemption value cannot be empty');
    }
    if (!props.reason || props.reason.trim().length === 0) {
      throw new Error('Exemption reason must be provided');
    }
    return new TaxExemption(id, props);
  }

  get type(): TaxExemptionType {
    return this.props.type;
  }

  get value(): string {
    return this.props.value;
  }

  get reason(): string {
    return this.props.reason;
  }
}
