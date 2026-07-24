import { AggregateRoot } from '@saas/domain';
import {
  ChartId,
  ChartCode,
  ChartName,
  ChartVersion,
  ChartStatus,
  ChartStatusEnum,
  AccountCode,
  AccountName,
  AccountCategory,
  AccountType,
  NormalBalance,
  CurrencyRestriction
} from '../value-objects/chart-of-accounts-core';
import { Account } from '../entities/account';
import { AccountHierarchy } from '../entities/account-hierarchy';
import { AccountMapping } from '../entities/account-mapping';
import { AccountHistoryEntry } from '../entities/account-history-entry';
import {
  ChartCreated,
  ChartActivated,
  ChartArchived,
  AccountAdded,
  AccountUpdated,
  AccountMoved,
  AccountDeactivated,
  AccountMappingChanged
} from '../events/chart-events';
import { UniqueAccountCodeSpecification, HierarchyIntegritySpecification } from '../rules/accounting-rules';
import { AccountHierarchyService } from '../services/accounting-services';

export class ChartOfAccounts extends AggregateRoot<ChartId> {
  private _status: ChartStatus;
  private _accounts: Account[] = [];
  private _hierarchies: AccountHierarchy[] = [];
  private _mappings: AccountMapping[] = [];
  private _history: AccountHistoryEntry[] = [];

  constructor(
    id: ChartId,
    public readonly code: ChartCode,
    public readonly name: ChartName,
    public readonly versionTag: ChartVersion,
    status: ChartStatus = ChartStatus.create(ChartStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    code: ChartCode,
    name: ChartName,
    versionTag: ChartVersion
  ): ChartOfAccounts {
    const id = ChartId.generate();
    const chart = new ChartOfAccounts(id, code, name, versionTag);

    chart.record(new ChartCreated(id.toValue(), chart.version(), {
      chartId: id.toValue(),
      chartCode: code.toValue()
    }));

    return chart;
  }

  get status(): ChartStatus { return this._status; }
  get accounts(): Account[] { return [...this._accounts]; }
  get hierarchies(): AccountHierarchy[] { return [...this._hierarchies]; }

  public activate(): void {
    if (this._status.toValue() !== ChartStatusEnum.DRAFT) {
      throw new Error('Only DRAFT charts can be activated.');
    }
    
    this._status = ChartStatus.create(ChartStatusEnum.ACTIVE);
    this.record(new ChartActivated(this.id.toValue(), this.version(), {
      chartId: this.id.toValue()
    }));
  }

  public archive(): void {
    if (this._status.toValue() === ChartStatusEnum.ARCHIVED) return;
    this._status = ChartStatus.create(ChartStatusEnum.ARCHIVED);
    this.record(new ChartArchived(this.id.toValue(), this.version(), {
      chartId: this.id.toValue()
    }));
  }

  public addAccount(
    code: AccountCode,
    name: AccountName,
    category: AccountCategory,
    type: AccountType,
    normalBalance: NormalBalance,
    currencyRestriction: CurrencyRestriction | null = null,
    parentId: string | null = null
  ): void {
    if (this._status.toValue() === ChartStatusEnum.ARCHIVED) {
      throw new Error('Cannot modify an ARCHIVED chart.');
    }

    const uniqueSpec = new UniqueAccountCodeSpecification();
    const existingCodes = this._accounts.map(a => a.code.toValue());
    if (!uniqueSpec.isSatisfiedBy({ codes: existingCodes, candidate: code.toValue() })) {
      throw new Error(`Account code ${code.toValue()} already exists in this chart.`);
    }

    const account = Account.create(code, name, category, type, normalBalance, currencyRestriction);
    this._accounts.push(account);

    if (parentId) {
      this._hierarchies.push(AccountHierarchy.create(parentId, account.id.toValue()));
    }

    this.record(new AccountAdded(this.id.toValue(), this.version(), {
      chartId: this.id.toValue(),
      accountId: account.id.toValue(),
      accountCode: code.toValue()
    }));
  }

  public updateAccount(accountId: string, newName: string): void {
    const account = this._accounts.find(a => a.id.toValue() === accountId);
    if (!account) throw new Error('Account not found');
    
    // In a full implementation we would clone or have setter for name on Account Entity
    // account.updateName(newName);
    
    this.record(new AccountUpdated(this.id.toValue(), this.version(), {
      chartId: this.id.toValue(),
      accountId
    }));
  }

  public deactivateAccount(accountId: string): void {
    const account = this._accounts.find(a => a.id.toValue() === accountId);
    if (!account) throw new Error('Account not found');
    
    account.deactivate();

    this.record(new AccountDeactivated(this.id.toValue(), this.version(), {
      chartId: this.id.toValue(),
      accountId
    }));
  }

  public moveAccount(accountId: string, newParentId: string | null, hierarchyService: AccountHierarchyService): void {
    if (this._status.toValue() === ChartStatusEnum.ARCHIVED) {
      throw new Error('Cannot modify an ARCHIVED chart.');
    }

    const edges = this._hierarchies.map(h => ({ parent: h.parentAccountId, child: h.childAccountId }));
    
    if (!hierarchyService.canMove(accountId, newParentId, edges)) {
      throw new Error('Invalid move operation detected.');
    }

    const integritySpec = new HierarchyIntegritySpecification();
    if (newParentId && !integritySpec.isSatisfiedBy({ edges, candidateParent: newParentId, candidateChild: accountId })) {
      throw new Error('Moving account creates a cycle in the hierarchy.');
    }

    this._hierarchies = this._hierarchies.filter(h => h.childAccountId !== accountId);
    if (newParentId) {
      this._hierarchies.push(AccountHierarchy.create(newParentId, accountId));
    }

    this.record(new AccountMoved(this.id.toValue(), this.version(), {
      chartId: this.id.toValue(),
      accountId,
      newParentId
    }));
  }

  public registerAccountMapping(accountId: string, externalSystem: string, externalCode: string): void {
    const mapping = AccountMapping.create(accountId, externalSystem, externalCode);
    this._mappings.push(mapping);

    this.record(new AccountMappingChanged(this.id.toValue(), this.version(), {
      chartId: this.id.toValue(),
      accountId,
      externalSystem
    }));
  }
}
