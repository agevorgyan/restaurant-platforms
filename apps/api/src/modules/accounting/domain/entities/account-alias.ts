import { Entity, Identifier } from '@saas/domain';

export class AccountAliasId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountAliasId { return new AccountAliasId(value); }
  public static generate(): AccountAliasId { return new AccountAliasId(crypto.randomUUID()); }
}

export class AccountAlias extends Entity<AccountAliasId> {
  constructor(
    id: AccountAliasId,
    public readonly accountId: string,
    public readonly alias: string,
    public readonly context: string
  ) {
    super(id);
  }

  public static create(accountId: string, alias: string, context: string): AccountAlias {
    return new AccountAlias(AccountAliasId.generate(), accountId, alias, context);
  }
}
