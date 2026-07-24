import { Entity, Identifier } from '@saas/domain';

export class AccountMappingId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountMappingId { return new AccountMappingId(value); }
  public static generate(): AccountMappingId { return new AccountMappingId(crypto.randomUUID()); }
}

export class AccountMapping extends Entity<AccountMappingId> {
  constructor(
    id: AccountMappingId,
    public readonly accountId: string,
    public readonly externalSystem: string,
    public readonly externalCode: string
  ) {
    super(id);
  }

  public static create(accountId: string, externalSystem: string, externalCode: string): AccountMapping {
    return new AccountMapping(AccountMappingId.generate(), accountId, externalSystem, externalCode);
  }
}
