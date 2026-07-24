import { Identifier, DomainPrimitive, ValueObject } from '@saas/domain';

export class ChartId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ChartId { return new ChartId(value); }
  public static generate(): ChartId { return new ChartId(crypto.randomUUID()); }
}

export class ChartCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ChartCode {
    if (!value || value.trim().length === 0) throw new Error('Chart code cannot be empty.');
    return new ChartCode(value);
  }
}

export class ChartName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ChartName {
    if (!value || value.trim().length === 0) throw new Error('Chart name cannot be empty.');
    return new ChartName(value);
  }
}

export class ChartVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ChartVersion {
    return new ChartVersion(value);
  }
}

export enum ChartStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export class ChartStatus extends DomainPrimitive<ChartStatusEnum> {
  private constructor(value: ChartStatusEnum) { super(value); }
  public static create(value: ChartStatusEnum): ChartStatus {
    if (!Object.values(ChartStatusEnum).includes(value)) {
      throw new Error(`Invalid chart status: ${value}`);
    }
    return new ChartStatus(value);
  }
}

export class AccountCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountCode {
    if (!value || value.trim().length === 0) throw new Error('Account code cannot be empty.');
    return new AccountCode(value);
  }
}

export class AccountName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AccountName {
    if (!value || value.trim().length === 0) throw new Error('Account name cannot be empty.');
    return new AccountName(value);
  }
}

export enum AccountCategoryEnum {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export class AccountCategory extends DomainPrimitive<AccountCategoryEnum> {
  private constructor(value: AccountCategoryEnum) { super(value); }
  public static create(value: AccountCategoryEnum): AccountCategory {
    if (!Object.values(AccountCategoryEnum).includes(value)) {
      throw new Error(`Invalid account category: ${value}`);
    }
    return new AccountCategory(value);
  }
}

export enum AccountTypeEnum {
  BANK = 'BANK',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  INVENTORY = 'INVENTORY',
  FIXED_ASSET = 'FIXED_ASSET',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  SALES_REVENUE = 'SALES_REVENUE',
  COST_OF_GOODS_SOLD = 'COST_OF_GOODS_SOLD',
  OPERATING_EXPENSE = 'OPERATING_EXPENSE',
  PAYROLL_EXPENSE = 'PAYROLL_EXPENSE',
  TAX_PAYABLE = 'TAX_PAYABLE',
  OTHER = 'OTHER'
}

export class AccountType extends DomainPrimitive<AccountTypeEnum> {
  private constructor(value: AccountTypeEnum) { super(value); }
  public static create(value: AccountTypeEnum): AccountType {
    if (!Object.values(AccountTypeEnum).includes(value)) {
      throw new Error(`Invalid account type: ${value}`);
    }
    return new AccountType(value);
  }
}

export enum NormalBalanceEnum {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export class NormalBalance extends DomainPrimitive<NormalBalanceEnum> {
  private constructor(value: NormalBalanceEnum) { super(value); }
  public static create(value: NormalBalanceEnum): NormalBalance {
    if (!Object.values(NormalBalanceEnum).includes(value)) {
      throw new Error(`Invalid normal balance: ${value}`);
    }
    return new NormalBalance(value);
  }
}

export class CurrencyRestriction extends DomainPrimitive<string | null> {
  private constructor(value: string | null) { super(value); }
  public static create(value: string | null): CurrencyRestriction {
    if (value && value.trim().length !== 3) throw new Error('Currency restriction must be a 3-letter code or null.');
    return new CurrencyRestriction(value ? value.toUpperCase() : null);
  }
}
