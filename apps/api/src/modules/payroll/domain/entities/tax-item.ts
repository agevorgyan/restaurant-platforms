import { Entity, Identifier } from '@saas/domain';
import { TaxAmount } from '../value-objects/money-types';

export class TaxItemId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxItemId { return new TaxItemId(value); }
  public static generate(): TaxItemId { return new TaxItemId(crypto.randomUUID()); }
}

export class TaxItem extends Entity<TaxItemId> {
  constructor(
    id: TaxItemId,
    public readonly taxCode: string,
    public readonly description: string,
    public readonly amount: TaxAmount
  ) {
    super(id);
  }

  public static create(taxCode: string, description: string, amount: TaxAmount): TaxItem {
    return new TaxItem(TaxItemId.generate(), taxCode, description, amount);
  }
}
