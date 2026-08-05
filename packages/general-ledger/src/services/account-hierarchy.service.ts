import { ChartOfAccountsAggregate } from '../domain/models/chart-of-accounts.aggregate';
import { AccountAggregate } from '../domain/models/account.aggregate';
import { AccountId } from '../domain/value-objects/account-id.vo';
import { AccountPath } from '../domain/value-objects/account-path.vo';
import { ValidationService } from './validation.service';

export interface HierarchyNode {
  account: AccountAggregate;
  children: HierarchyNode[];
  depth: number;
}

export class AccountHierarchyService {
  constructor(private readonly validator: ValidationService = new ValidationService()) {}

  public reparentAccount(coa: ChartOfAccountsAggregate, accountId: AccountId, newParentId: AccountId): AccountAggregate {
    const account = coa.findAccountById(accountId);
    if (!account) {
      throw new Error(`Account ID ${accountId.getValue()} not found.`);
    }

    this.validator.validateHierarchyAttachment(coa, accountId, newParentId);

    const newParent = coa.findAccountById(newParentId)!;
    const newPath: AccountPath = newParent.getPath().append(account.getCode().getValue());

    account.setParent(newParentId, newPath);
    this.updateSubtreePaths(coa, account);

    return account;
  }

  public buildTree(coa: ChartOfAccountsAggregate): HierarchyNode[] {
    const all = coa.getAllAccounts();
    const roots = all.filter((a) => !a.getParentAccountId());

    const buildNode = (acc: AccountAggregate): HierarchyNode => {
      const children = coa.getChildren(acc.getId()).map(buildNode);
      return {
        account: acc,
        children,
        depth: acc.getPath().getDepth(),
      };
    };

    return roots.map(buildNode);
  }

  private updateSubtreePaths(coa: ChartOfAccountsAggregate, parent: AccountAggregate): void {
    const children = coa.getChildren(parent.getId());
    for (const child of children) {
      const childPath = parent.getPath().append(child.getCode().getValue());
      child.setParent(parent.getId(), childPath);
      this.updateSubtreePaths(coa, child);
    }
  }
}
