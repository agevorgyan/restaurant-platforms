import { KpiSnapshot, KpiTrend, KpiHistory, KpiBenchmark } from '../read-models';

export interface KpiFilterCriteria {
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  restaurantId?: string;
  branchId?: string;
}

export class FinancialKpiGenerator {
  public async generateRevenueSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'FIN-001',
      code: 'REV_GROSS',
      name: 'Gross Revenue',
      category: 'FINANCIAL',
      value: 0,
      unit: 'CURRENCY',
      timestamp: new Date(),
      period: 'MONTHLY',
      trendDirection: 'UP',
      trendPercentage: 0
    };
  }
}

export class SalesKpiGenerator {
  public async generateWinRateSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'SLS-001',
      code: 'WIN_RATE',
      name: 'Sales Win Rate',
      category: 'SALES',
      value: 0,
      unit: 'PERCENTAGE',
      timestamp: new Date(),
      period: 'MONTHLY',
      trendDirection: 'FLAT',
      trendPercentage: 0
    };
  }
}

export class CustomerKpiGenerator {
  public async generateClvSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'CUS-001',
      code: 'CLV',
      name: 'Customer Lifetime Value',
      category: 'CRM',
      value: 0,
      unit: 'CURRENCY',
      timestamp: new Date(),
      period: 'YEARLY',
      trendDirection: 'UP',
      trendPercentage: 0
    };
  }
}

export class InventoryKpiGenerator {
  public async generateTurnoverSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'INV-001',
      code: 'INV_TURNOVER',
      name: 'Inventory Turnover Ratio',
      category: 'INVENTORY',
      value: 0,
      unit: 'RATIO',
      timestamp: new Date(),
      period: 'MONTHLY',
      trendDirection: 'FLAT',
      trendPercentage: 0
    };
  }
}

export class MarketingKpiGenerator {
  public async generateCacSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'MKT-001',
      code: 'CAC',
      name: 'Customer Acquisition Cost',
      category: 'MARKETING',
      value: 0,
      unit: 'CURRENCY',
      timestamp: new Date(),
      period: 'MONTHLY',
      trendDirection: 'DOWN',
      trendPercentage: 0
    };
  }
}

export class WorkforceKpiGenerator {
  public async generateLaborCostSnapshot(criteria: KpiFilterCriteria): Promise<KpiSnapshot> {
    return {
      kpiId: 'HR-001',
      code: 'LABOR_COST_PCT',
      name: 'Labor Cost Percentage',
      category: 'WORKFORCE',
      value: 0,
      unit: 'PERCENTAGE',
      timestamp: new Date(),
      period: 'WEEKLY',
      trendDirection: 'UP',
      trendPercentage: 0
    };
  }
}
