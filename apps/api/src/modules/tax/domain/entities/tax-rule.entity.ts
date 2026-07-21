import { Entity } from '@saas/core';
import { TaxRate } from '../value-objects/tax-rate.value-object';
import { TaxType } from '../value-objects/tax-type.value-object';
import { TaxJurisdiction } from './tax-jurisdiction.entity';
import { TaxCategory } from './tax-category.entity';

export interface TaxRuleProps {
  rate: TaxRate;
  type: TaxType;
  jurisdictions: TaxJurisdiction[];
  categories: TaxCategory[];
}

export class TaxRule extends Entity<TaxRuleProps> {
  private constructor(id: string, props: TaxRuleProps) {
    super(id, props);
  }

  public static create(id: string, props: TaxRuleProps): TaxRule {
    if (props.jurisdictions.length === 0) {
      throw new Error('A TaxRule must have at least one jurisdiction');
    }
    if (props.categories.length === 0) {
      throw new Error('A TaxRule must have at least one category');
    }
    return new TaxRule(id, props);
  }

  get rate(): TaxRate {
    return this.props.rate;
  }

  get type(): TaxType {
    return this.props.type;
  }

  get jurisdictions(): TaxJurisdiction[] {
    return [...this.props.jurisdictions];
  }

  get categories(): TaxCategory[] {
    return [...this.props.categories];
  }
}
