import { AccountAggregate } from '../domain/models/account.aggregate';
import { AccountName } from '../domain/value-objects/account-name.vo';
import { AccountCategory } from '../domain/value-objects/account-category.vo';
import { AccountClassification } from '../domain/value-objects/account-classification.vo';
import { ChartOfAccountsAggregate } from '../domain/models/chart-of-accounts.aggregate';

export class AccountService {
  public updateAccountDetails(
    account: AccountAggregate,
    name: AccountName,
    category?: AccountCategory,
    classification?: AccountClassification
  ): void {
    account.updateDetails(name, category, classification);
  }

  public activateAccount(account: AccountAggregate): void {
    account.activate();
  }

  public deactivateAccount(account: AccountAggregate): void {
    account.deactivate();
  }

  public blockAccount(account: AccountAggregate): void {
    account.block();
  }

  public archiveAccount(coa: ChartOfAccountsAggregate, account: AccountAggregate): void {
    const children = coa.getChildren(account.getId());
    const activeChildren = children.filter((c) => c.getStatus() !== 'ARCHIVED');
    if (activeChildren.length > 0) {
      throw new Error(`Cannot archive account ${account.getCode().getValue()} because it has active child accounts.`);
    }
    account.archive();
  }
}
