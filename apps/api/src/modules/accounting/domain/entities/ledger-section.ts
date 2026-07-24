import { Entity, Identifier } from '@saas/domain';

export class LedgerSectionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerSectionId { return new LedgerSectionId(value); }
  public static generate(): LedgerSectionId { return new LedgerSectionId(crypto.randomUUID()); }
}

export class LedgerSection extends Entity<LedgerSectionId> {
  constructor(
    id: LedgerSectionId,
    public readonly code: string,
    public readonly name: string,
    public readonly description: string
  ) {
    super(id);
  }

  public static create(code: string, name: string, description: string = ''): LedgerSection {
    return new LedgerSection(LedgerSectionId.generate(), code, name, description);
  }
}
