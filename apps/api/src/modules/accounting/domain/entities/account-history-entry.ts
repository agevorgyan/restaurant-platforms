import { Entity, Identifier } from '@saas/domain';

export class AccountHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountHistoryEntryId { return new AccountHistoryEntryId(value); }
  public static generate(): AccountHistoryEntryId { return new AccountHistoryEntryId(crypto.randomUUID()); }
}

export class AccountHistoryEntry extends Entity<AccountHistoryEntryId> {
  constructor(
    id: AccountHistoryEntryId,
    public readonly accountId: string,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(accountId: string, action: string, performedBy: string, details: string = ''): AccountHistoryEntry {
    return new AccountHistoryEntry(AccountHistoryEntryId.generate(), accountId, action, performedBy, new Date(), details);
  }
}
