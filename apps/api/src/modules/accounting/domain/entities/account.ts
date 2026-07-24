import { Entity, Identifier } from '@saas/domain';
import { AccountCode, AccountName, AccountCategory, AccountType, NormalBalance, CurrencyRestriction } from '../value-objects/chart-of-accounts-core';

export class AccountId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountId { return new AccountId(value); }
  public static generate(): AccountId { return new AccountId(crypto.randomUUID()); }
}

export class Account extends Entity<AccountId> {
  private _isActive: boolean = true;

  constructor(
    id: AccountId,
    public readonly code: AccountCode,
    public readonly name: AccountName,
    public readonly category: AccountCategory,
    public readonly type: AccountType,
    public readonly normalBalance: NormalBalance,
    public readonly currencyRestriction: CurrencyRestriction | null
  ) {
    super(id);
  }

  public static create(
    code: AccountCode,
    name: AccountName,
    category: AccountCategory,
    type: AccountType,
    normalBalance: NormalBalance,
    currencyRestriction: CurrencyRestriction | null = null
  ): Account {
    return new Account(AccountId.generate(), code, name, category, type, normalBalance, currencyRestriction);
  }

  get isActive(): boolean {
    return this._isActive;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public activate(): void {
    this._isActive = true;
  }
}
