import { Entity, Identifier } from '@saas/domain';

export class AccountHierarchyId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountHierarchyId { return new AccountHierarchyId(value); }
  public static generate(): AccountHierarchyId { return new AccountHierarchyId(crypto.randomUUID()); }
}

export class AccountHierarchy extends Entity<AccountHierarchyId> {
  constructor(
    id: AccountHierarchyId,
    public readonly parentAccountId: string | null,
    public readonly childAccountId: string
  ) {
    super(id);
  }

  public static create(parentAccountId: string | null, childAccountId: string): AccountHierarchy {
    return new AccountHierarchy(AccountHierarchyId.generate(), parentAccountId, childAccountId);
  }
}
