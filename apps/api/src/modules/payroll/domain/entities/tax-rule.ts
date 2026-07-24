import { Entity, Identifier } from '@saas/domain';
import { TaxBracket } from './tax-bracket';

export class TaxRuleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxRuleId { return new TaxRuleId(value); }
  public static generate(): TaxRuleId { return new TaxRuleId(crypto.randomUUID()); }
}

export class TaxRule extends Entity<TaxRuleId> {
  constructor(
    id: TaxRuleId,
    public readonly code: string,
    public readonly name: string,
    public readonly type: string,
    public readonly brackets: TaxBracket[],
    public readonly isProgressive: boolean
  ) {
    super(id);
  }

  public static create(code: string, name: string, type: string, brackets: TaxBracket[], isProgressive: boolean): TaxRule {
    return new TaxRule(TaxRuleId.generate(), code, name, type, brackets, isProgressive);
  }
}
