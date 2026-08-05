import { ChartOfAccountsAggregate } from '../domain/models/chart-of-accounts.aggregate';
import { AccountAggregate } from '../domain/models/account.aggregate';
import { AccountCode } from '../domain/value-objects/account-code.vo';
import { AccountId } from '../domain/value-objects/account-id.vo';
import { PostingRule } from '../domain/value-objects/posting-rule.vo';
import { AccountDimension } from '../domain/value-objects/account-dimension.vo';

export class ValidationService {
  public validateCodeUniqueness(coa: ChartOfAccountsAggregate, code: AccountCode): void {
    const existing = coa.getAccountByCode(code);
    if (existing) {
      throw new Error(`Account code ${code.getValue()} is already taken in Chart of Accounts.`);
    }
  }

  public validateHierarchyAttachment(
    coa: ChartOfAccountsAggregate,
    accountId: AccountId,
    targetParentId: AccountId
  ): void {
    if (accountId.equals(targetParentId)) {
      throw new Error('An account cannot be attached to itself as parent.');
    }

    const parent = coa.findAccountById(targetParentId);
    if (!parent) {
      throw new Error(`Target parent account ID ${targetParentId.getValue()} not found.`);
    }

    if (parent.getStatus() === 'ARCHIVED') {
      throw new Error('Cannot attach an account to an archived parent.');
    }

    coa.validateNoCycles(accountId, targetParentId);
  }

  public validatePostingPermitted(account: AccountAggregate, isManualPosting: boolean): void {
    if (account.getStatus() !== 'ACTIVE') {
      throw new Error(`Account ${account.getCode().getValue()} is not ACTIVE (status: ${account.getStatus()}). Posting denied.`);
    }

    if (account.isHeaderAccount()) {
      throw new Error(`Account ${account.getCode().getValue()} is a header account. Direct posting denied.`);
    }

    const rule: PostingRule = account.getPostingRule();
    if (isManualPosting && !rule.isManualPostingAllowed()) {
      throw new Error(`Manual posting is disabled for account ${account.getCode().getValue()}.`);
    }

    if (!isManualPosting && !rule.isAutomatedPostingAllowed()) {
      throw new Error(`Automated posting is disabled for account ${account.getCode().getValue()}.`);
    }
  }

  public validateDimensionTags(account: AccountAggregate, providedDimensions: string[]): void {
    const requiredDims = account.getDimensions().filter((d: AccountDimension) => d.getIsMandatory());
    for (const req of requiredDims) {
      if (!providedDimensions.includes(req.getDimensionKey())) {
        throw new Error(`Mandatory dimension '${req.getDimensionKey()}' is missing for account ${account.getCode().getValue()}.`);
      }
    }
  }
}
