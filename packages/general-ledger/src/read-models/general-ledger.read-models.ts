export interface ChartOfAccountsReadModel {
  tenantId: string;
  name: string;
  totalAccounts: number;
  accounts: {
    id: string;
    code: string;
    name: string;
    type: string;
    status: string;
    path: string;
    parentAccountId?: string;
    isHeader: boolean;
  }[];
}

export interface HierarchyNodeReadModel {
  id: string;
  code: string;
  name: string;
  type: string;
  depth: number;
  children: HierarchyNodeReadModel[];
}

export interface AccountHierarchyReadModel {
  tenantId: string;
  rootCount: number;
  hierarchy: HierarchyNodeReadModel[];
}

export interface PostingRulesReadModel {
  tenantId: string;
  rules: {
    accountCode: string;
    accountName: string;
    allowManualPosting: boolean;
    allowAutomatedPosting: boolean;
    requireDimensionTag: boolean;
  }[];
}

export interface AccountStatisticsReadModel {
  tenantId: string;
  totalAccounts: number;
  countsByType: Record<string, number>;
  countsByStatus: Record<string, number>;
}
