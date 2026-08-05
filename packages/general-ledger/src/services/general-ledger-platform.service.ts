import { ChartOfAccountsAggregate } from '../domain/models/chart-of-accounts.aggregate';
import { AccountAggregate } from '../domain/models/account.aggregate';
import { ChartOfAccountsService, CreateAccountParams } from './chart-of-accounts.service';
import { AccountHierarchyService, HierarchyNode } from './account-hierarchy.service';
import { AccountService } from './account.service';
import { PostingRuleService } from './posting-rule.service';
import { AccountId } from '../domain/value-objects/account-id.vo';
import { AccountCode } from '../domain/value-objects/account-code.vo';
import { PostingRule } from '../domain/value-objects/posting-rule.vo';
import {
  ChartOfAccountsReadModel,
  AccountHierarchyReadModel,
  HierarchyNodeReadModel,
  PostingRulesReadModel,
  AccountStatisticsReadModel,
} from '../read-models/general-ledger.read-models';

export class GeneralLedgerPlatformService {
  private tenantCoaMap: Map<string, ChartOfAccountsAggregate> = new Map();

  constructor(
    private readonly coaService: ChartOfAccountsService = new ChartOfAccountsService(),
    private readonly hierarchyService: AccountHierarchyService = new AccountHierarchyService(),
    private readonly accountService: AccountService = new AccountService(),
    private readonly postingRuleService: PostingRuleService = new PostingRuleService()
  ) {}

  public getOrCreateChartOfAccounts(tenantId: string, name?: string): ChartOfAccountsAggregate {
    let coa = this.tenantCoaMap.get(tenantId);
    if (!coa) {
      coa = ChartOfAccountsAggregate.create(tenantId, name || `CoA for Tenant ${tenantId}`);
      this.tenantCoaMap.set(tenantId, coa);
    }
    return coa;
  }

  public createAccount(tenantId: string, params: CreateAccountParams): AccountAggregate {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    return this.coaService.createAccount(coa, params);
  }

  public reparentAccount(tenantId: string, accountId: string, newParentId: string): AccountAggregate {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    return this.hierarchyService.reparentAccount(coa, AccountId.create(accountId), AccountId.create(newParentId));
  }

  public updatePostingRule(
    tenantId: string,
    accountCode: string,
    ruleProps: { allowManualPosting?: boolean; allowAutomatedPosting?: boolean; requireDimensionTag?: boolean }
  ): AccountAggregate {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const account = coa.getAccountByCode(AccountCode.create(accountCode));
    if (!account) {
      throw new Error(`Account code ${accountCode} not found in tenant ${tenantId}`);
    }
    const rule = PostingRule.create({
      allowManualPosting: ruleProps.allowManualPosting,
      allowAutomatedPosting: ruleProps.allowAutomatedPosting,
      requireDimensionTag: ruleProps.requireDimensionTag,
    });
    this.postingRuleService.configurePostingRule(account, rule);
    return account;
  }

  public archiveAccount(tenantId: string, accountId: string): void {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const account = coa.findAccountById(AccountId.create(accountId));
    if (!account) {
      throw new Error(`Account ID ${accountId} not found in tenant ${tenantId}`);
    }
    this.accountService.archiveAccount(coa, account);
  }

  public getChartOfAccountsReadModel(tenantId: string): ChartOfAccountsReadModel {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const accounts = coa.getAllAccounts();
    return {
      tenantId,
      name: coa.getName(),
      totalAccounts: accounts.length,
      accounts: accounts.map((a) => ({
        id: a.getId().getValue(),
        code: a.getCode().getValue(),
        name: a.getName().getValue(),
        type: a.getType(),
        status: a.getStatus(),
        path: a.getPath().getValue(),
        parentAccountId: a.getParentAccountId()?.getValue(),
        isHeader: a.isHeaderAccount(),
      })),
    };
  }

  public getAccountHierarchyReadModel(tenantId: string): AccountHierarchyReadModel {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const tree = this.hierarchyService.buildTree(coa);

    const mapNode = (node: HierarchyNode): HierarchyNodeReadModel => ({
      id: node.account.getId().getValue(),
      code: node.account.getCode().getValue(),
      name: node.account.getName().getValue(),
      type: node.account.getType(),
      depth: node.depth,
      children: node.children.map(mapNode),
    });

    return {
      tenantId,
      rootCount: tree.length,
      hierarchy: tree.map(mapNode),
    };
  }

  public getPostingRulesReadModel(tenantId: string): PostingRulesReadModel {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const accounts = coa.getAllAccounts();
    return {
      tenantId,
      rules: accounts.map((a) => ({
        accountCode: a.getCode().getValue(),
        accountName: a.getName().getValue(),
        allowManualPosting: a.getPostingRule().isManualPostingAllowed(),
        allowAutomatedPosting: a.getPostingRule().isAutomatedPostingAllowed(),
        requireDimensionTag: a.getPostingRule().isDimensionTagRequired(),
      })),
    };
  }

  public getAccountStatisticsReadModel(tenantId: string): AccountStatisticsReadModel {
    const coa = this.getOrCreateChartOfAccounts(tenantId);
    const accounts = coa.getAllAccounts();

    const countsByType: Record<string, number> = {};
    const countsByStatus: Record<string, number> = {};

    accounts.forEach((a) => {
      countsByType[a.getType()] = (countsByType[a.getType()] || 0) + 1;
      countsByStatus[a.getStatus()] = (countsByStatus[a.getStatus()] || 0) + 1;
    });

    return {
      tenantId,
      totalAccounts: accounts.length,
      countsByType,
      countsByStatus,
    };
  }
}
