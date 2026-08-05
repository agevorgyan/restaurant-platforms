import { AccountAggregate } from './account.aggregate';
import { AccountCode } from '../value-objects/account-code.vo';
import { AccountId } from '../value-objects/account-id.vo';
import { AccountPath } from '../value-objects/account-path.vo';

export class ChartOfAccountsAggregate {
  private accounts: Map<string, AccountAggregate> = new Map();

  private constructor(
    private readonly tenantId: string,
    private readonly name: string,
    private readonly maxDepth: number = 10
  ) {}

  public static create(tenantId: string, name: string = 'Standard Chart of Accounts', maxDepth: number = 10): ChartOfAccountsAggregate {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('Tenant ID cannot be empty');
    }
    return new ChartOfAccountsAggregate(tenantId.trim(), name.trim(), maxDepth);
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getName(): string {
    return this.name;
  }

  public getMaxDepth(): number {
    return this.maxDepth;
  }

  public addAccount(account: AccountAggregate): void {
    if (account.getTenantId() !== this.tenantId) {
      throw new Error(`Tenant mismatch: account tenant ${account.getTenantId()} does not match Chart of Accounts tenant ${this.tenantId}`);
    }

    const codeStr = account.getCode().getValue();
    if (this.accounts.has(codeStr)) {
      throw new Error(`Account code ${codeStr} already exists in Chart of Accounts.`);
    }

    if (account.getParentAccountId()) {
      const parent = this.findAccountById(account.getParentAccountId()!);
      if (!parent) {
        throw new Error(`Parent account with ID ${account.getParentAccountId()!.getValue()} not found.`);
      }
      const parentPath = parent.getPath();
      if (parentPath.getDepth() >= this.maxDepth) {
        throw new Error(`Adding child account exceeds maximum depth limit of ${this.maxDepth}.`);
      }
    }

    this.accounts.set(codeStr, account);
  }

  public getAccountByCode(code: AccountCode): AccountAggregate | undefined {
    return this.accounts.get(code.getValue());
  }

  public findAccountById(id: AccountId): AccountAggregate | undefined {
    for (const acc of this.accounts.values()) {
      if (acc.getId().equals(id)) {
        return acc;
      }
    }
    return undefined;
  }

  public getAllAccounts(): AccountAggregate[] {
    return Array.from(this.accounts.values());
  }

  public getChildren(parentId: AccountId): AccountAggregate[] {
    return Array.from(this.accounts.values()).filter((acc) => acc.getParentAccountId()?.equals(parentId));
  }

  public validateNoCycles(accountId: AccountId, targetParentId: AccountId): void {
    let current: AccountAggregate | undefined = this.findAccountById(targetParentId);
    while (current) {
      if (current.getId().equals(accountId)) {
        throw new Error(`Cycle detected: Account ${accountId.getValue()} cannot be a parent of its own ancestor.`);
      }
      if (!current.getParentAccountId()) {
        break;
      }
      current = this.findAccountById(current.getParentAccountId()!);
    }
  }

  public computePathForChild(parentCode: AccountCode, childCode: AccountCode): AccountPath {
    const parent = this.getAccountByCode(parentCode);
    if (!parent) {
      throw new Error(`Parent account code ${parentCode.getValue()} not found.`);
    }
    return parent.getPath().append(childCode.getValue());
  }
}
