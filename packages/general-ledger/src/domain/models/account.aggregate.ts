import { AccountStatus } from '../enums/account-status.enum';
import { AccountType } from '../enums/account-type.enum';
import { NormalBalance } from '../enums/normal-balance.enum';
import { AccountId } from '../value-objects/account-id.vo';
import { AccountCode } from '../value-objects/account-code.vo';
import { AccountName } from '../value-objects/account-name.vo';
import { AccountPath } from '../value-objects/account-path.vo';
import { AccountCategory } from '../value-objects/account-category.vo';
import { AccountClassification } from '../value-objects/account-classification.vo';
import { AccountDimension } from '../value-objects/account-dimension.vo';
import { PostingRule } from '../value-objects/posting-rule.vo';

export interface AccountAggregateProps {
  id: AccountId;
  tenantId: string;
  code: AccountCode;
  name: AccountName;
  type: AccountType;
  normalBalance: NormalBalance;
  status: AccountStatus;
  path: AccountPath;
  parentAccountId?: AccountId;
  category?: AccountCategory;
  classification?: AccountClassification;
  dimensions: AccountDimension[];
  postingRule: PostingRule;
  isHeaderAccount: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountAggregate {
  private props: AccountAggregateProps;

  private constructor(props: AccountAggregateProps) {
    this.props = props;
  }

  public static create(params: {
    tenantId: string;
    code: AccountCode;
    name: AccountName;
    type: AccountType;
    normalBalance?: NormalBalance;
    parentAccountId?: AccountId;
    path?: AccountPath;
    category?: AccountCategory;
    classification?: AccountClassification;
    dimensions?: AccountDimension[];
    postingRule?: PostingRule;
    isHeaderAccount?: boolean;
  }): AccountAggregate {
    if (!params.tenantId || params.tenantId.trim().length === 0) {
      throw new Error('Tenant ID cannot be empty');
    }

    const defaultNormalBalance = params.normalBalance || AccountAggregate.determineDefaultNormalBalance(params.type);
    const path = params.path || AccountPath.create([params.code.getValue()]);

    return new AccountAggregate({
      id: AccountId.generate(),
      tenantId: params.tenantId.trim(),
      code: params.code,
      name: params.name,
      type: params.type,
      normalBalance: defaultNormalBalance,
      status: AccountStatus.ACTIVE,
      path,
      parentAccountId: params.parentAccountId,
      category: params.category,
      classification: params.classification,
      dimensions: params.dimensions || [],
      postingRule: params.postingRule || PostingRule.defaultRule(),
      isHeaderAccount: params.isHeaderAccount ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstruct(props: AccountAggregateProps): AccountAggregate {
    return new AccountAggregate(props);
  }

  public getId(): AccountId {
    return this.props.id;
  }

  public getTenantId(): string {
    return this.props.tenantId;
  }

  public getCode(): AccountCode {
    return this.props.code;
  }

  public getName(): AccountName {
    return this.props.name;
  }

  public getType(): AccountType {
    return this.props.type;
  }

  public getNormalBalance(): NormalBalance {
    return this.props.normalBalance;
  }

  public getStatus(): AccountStatus {
    return this.props.status;
  }

  public getPath(): AccountPath {
    return this.props.path;
  }

  public getParentAccountId(): AccountId | undefined {
    return this.props.parentAccountId;
  }

  public getCategory(): AccountCategory | undefined {
    return this.props.category;
  }

  public getClassification(): AccountClassification | undefined {
    return this.props.classification;
  }

  public getDimensions(): AccountDimension[] {
    return [...this.props.dimensions];
  }

  public getPostingRule(): PostingRule {
    return this.props.postingRule;
  }

  public isHeaderAccount(): boolean {
    return this.props.isHeaderAccount;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateDetails(name: AccountName, category?: AccountCategory, classification?: AccountClassification): void {
    this.ensureNotArchived();
    this.props.name = name;
    if (category) this.props.category = category;
    if (classification) this.props.classification = classification;
    this.props.updatedAt = new Date();
  }

  public updatePostingRule(rule: PostingRule): void {
    this.ensureNotArchived();
    this.props.postingRule = rule;
    this.props.updatedAt = new Date();
  }

  public setParent(parentId: AccountId, newPath: AccountPath): void {
    this.ensureNotArchived();
    if (parentId.equals(this.props.id)) {
      throw new Error('An account cannot be set as its own parent.');
    }
    this.props.parentAccountId = parentId;
    this.props.path = newPath;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    if (this.props.status === AccountStatus.ARCHIVED) {
      throw new Error('Archived accounts cannot be re-activated.');
    }
    this.props.status = AccountStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  public deactivate(): void {
    this.ensureNotArchived();
    this.props.status = AccountStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }

  public block(): void {
    this.ensureNotArchived();
    this.props.status = AccountStatus.BLOCKED;
    this.props.updatedAt = new Date();
  }

  public archive(): void {
    this.props.status = AccountStatus.ARCHIVED;
    this.props.updatedAt = new Date();
  }

  private ensureNotArchived(): void {
    if (this.props.status === AccountStatus.ARCHIVED) {
      throw new Error(`Account ${this.props.code.getValue()} is archived and cannot be modified.`);
    }
  }

  public static determineDefaultNormalBalance(type: AccountType): NormalBalance {
    switch (type) {
      case AccountType.ASSET:
      case AccountType.EXPENSE:
      case AccountType.CONTRA_REVENUE:
        return NormalBalance.DEBIT;
      case AccountType.LIABILITY:
      case AccountType.EQUITY:
      case AccountType.REVENUE:
      case AccountType.CONTRA_ASSET:
        return NormalBalance.CREDIT;
    }
  }
}
