import { Entity, Identifier } from '@saas/domain';

export class LedgerConfigurationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerConfigurationId { return new LedgerConfigurationId(value); }
  public static generate(): LedgerConfigurationId { return new LedgerConfigurationId(crypto.randomUUID()); }
}

export class LedgerConfiguration extends Entity<LedgerConfigurationId> {
  constructor(
    id: LedgerConfigurationId,
    public readonly allowBackdatedEntries: boolean,
    public readonly requireApprovalForAdjustments: boolean,
    public readonly automatedClosing: boolean
  ) {
    super(id);
  }

  public static create(allowBackdatedEntries: boolean, requireApprovalForAdjustments: boolean, automatedClosing: boolean): LedgerConfiguration {
    return new LedgerConfiguration(LedgerConfigurationId.generate(), allowBackdatedEntries, requireApprovalForAdjustments, automatedClosing);
  }
}
