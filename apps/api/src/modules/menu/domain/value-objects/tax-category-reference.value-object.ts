import { ValueObject } from '@saas/core';

export interface TaxCategoryReferenceProps { taxCategoryId: string; }

export class TaxCategoryReference extends ValueObject<TaxCategoryReferenceProps> {
  get taxCategoryId(): string { return this.props.taxCategoryId; }
  private constructor(props: TaxCategoryReferenceProps) { super(props); }
  public static create(taxCategoryId: string): TaxCategoryReference {
    if (!taxCategoryId) throw new Error('TaxCategoryReference cannot be empty');
    return new TaxCategoryReference({ taxCategoryId });
  }
}