import { ChartOfAccountsAggregate } from '../domain/models/chart-of-accounts.aggregate';
import { AccountAggregate } from '../domain/models/account.aggregate';
import { AccountCode } from '../domain/value-objects/account-code.vo';
import { AccountName } from '../domain/value-objects/account-name.vo';
import { AccountType } from '../domain/enums/account-type.enum';
import { AccountId } from '../domain/value-objects/account-id.vo';
import { AccountCategory } from '../domain/value-objects/account-category.vo';
import { AccountClassification } from '../domain/value-objects/account-classification.vo';
import { AccountDimension } from '../domain/value-objects/account-dimension.vo';
import { PostingRule } from '../domain/value-objects/posting-rule.vo';
import { ValidationService } from './validation.service';

export interface CreateAccountParams {
  code: string;
  name: string;
  type: AccountType;
  parentAccountId?: string;
  category?: { name: string; subCategory?: string };
  classification?: { standard: 'GAAP' | 'IFRS' | 'MANAGEMENT'; code: string; lineItem: string };
  dimensions?: { key: string; type?: 'COST_CENTER' | 'LOCATION' | 'CHANNEL' | 'PROJECT' | 'CUSTOM'; mandatory?: boolean }[];
  postingRule?: { allowManual?: boolean; allowAutomated?: boolean; requireDimensionTag?: boolean };
  isHeaderAccount?: boolean;
}

export class ChartOfAccountsService {
  constructor(private readonly validator: ValidationService = new ValidationService()) {}

  public createAccount(coa: ChartOfAccountsAggregate, params: CreateAccountParams): AccountAggregate {
    const codeVO = AccountCode.create(params.code);
    this.validator.validateCodeUniqueness(coa, codeVO);

    const nameVO = AccountName.create(params.name);
    let parentIdVO: AccountId | undefined;
    let path = coa.getAccountByCode(codeVO)?.getPath();

    if (params.parentAccountId) {
      parentIdVO = AccountId.create(params.parentAccountId);
      const parent = coa.findAccountById(parentIdVO);
      if (!parent) {
        throw new Error(`Parent account ${params.parentAccountId} not found`);
      }
      path = parent.getPath().append(codeVO.getValue());
    }

    const categoryVO = params.category
      ? AccountCategory.create(params.category.name, params.category.subCategory)
      : undefined;

    const classificationVO = params.classification
      ? AccountClassification.create(params.classification.standard, params.classification.code, params.classification.lineItem)
      : undefined;

    const dimensionsVO = params.dimensions
      ? params.dimensions.map((d) => AccountDimension.create(d.key, d.type, d.mandatory))
      : [];

    const postingRuleVO = params.postingRule
      ? PostingRule.create({
          allowManualPosting: params.postingRule.allowManual,
          allowAutomatedPosting: params.postingRule.allowAutomated,
          requireDimensionTag: params.postingRule.requireDimensionTag,
        })
      : PostingRule.defaultRule();

    const account = AccountAggregate.create({
      tenantId: coa.getTenantId(),
      code: codeVO,
      name: nameVO,
      type: params.type,
      parentAccountId: parentIdVO,
      path,
      category: categoryVO,
      classification: classificationVO,
      dimensions: dimensionsVO,
      postingRule: postingRuleVO,
      isHeaderAccount: params.isHeaderAccount,
    });

    coa.addAccount(account);
    return account;
  }
}
