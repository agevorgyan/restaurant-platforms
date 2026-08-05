import { Injectable } from '@nestjs/common';
import { GeneralLedgerPlatformService } from '@saas/general-ledger';
import { CreateAccountDto, ReparentAccountDto, UpdatePostingRuleDto } from './dto/general-ledger.dto';

@Injectable()
export class GeneralLedgerService {
  private readonly platformService = new GeneralLedgerPlatformService();

  public createAccount(tenantId: string, dto: CreateAccountDto) {
    return this.platformService.createAccount(tenantId, {
      code: dto.code,
      name: dto.name,
      type: dto.type,
      parentAccountId: dto.parentAccountId,
      isHeaderAccount: dto.isHeaderAccount,
    });
  }

  public reparentAccount(tenantId: string, accountId: string, dto: ReparentAccountDto) {
    return this.platformService.reparentAccount(tenantId, accountId, dto.newParentId);
  }

  public updatePostingRule(tenantId: string, accountCode: string, dto: UpdatePostingRuleDto) {
    return this.platformService.updatePostingRule(tenantId, accountCode, {
      allowManualPosting: dto.allowManualPosting,
      allowAutomatedPosting: dto.allowAutomatedPosting,
      requireDimensionTag: dto.requireDimensionTag,
    });
  }

  public archiveAccount(tenantId: string, accountId: string) {
    this.platformService.archiveAccount(tenantId, accountId);
    return { success: true, message: `Account ${accountId} archived` };
  }

  public getChartOfAccounts(tenantId: string) {
    return this.platformService.getChartOfAccountsReadModel(tenantId);
  }

  public getAccountHierarchy(tenantId: string) {
    return this.platformService.getAccountHierarchyReadModel(tenantId);
  }

  public getPostingRules(tenantId: string) {
    return this.platformService.getPostingRulesReadModel(tenantId);
  }

  public getAccountStatistics(tenantId: string) {
    return this.platformService.getAccountStatisticsReadModel(tenantId);
  }
}
