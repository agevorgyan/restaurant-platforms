import { Controller, Get, Query } from '@nestjs/common';
import { 
  KpiFilterCriteria,
  FinancialKpiGenerator,
  SalesKpiGenerator,
  CustomerKpiGenerator,
  InventoryKpiGenerator,
  MarketingKpiGenerator,
  WorkforceKpiGenerator
} from '../../application/services';
import { KpiSnapshot, KpiHistory, KpiTrend } from '../../application/read-models';

@Controller('enterprise/kpis')
export class EnterpriseKpiController {
  constructor(
    private readonly financialKpis: FinancialKpiGenerator,
    private readonly salesKpis: SalesKpiGenerator,
    private readonly customerKpis: CustomerKpiGenerator,
    private readonly inventoryKpis: InventoryKpiGenerator,
    private readonly marketingKpis: MarketingKpiGenerator,
    private readonly workforceKpis: WorkforceKpiGenerator
  ) {}

  @Get()
  async getAllKpis(@Query() criteria: KpiFilterCriteria): Promise<KpiSnapshot[]> {
    const results = await Promise.all([
      this.financialKpis.generateRevenueSnapshot(criteria),
      this.salesKpis.generateWinRateSnapshot(criteria),
      this.customerKpis.generateClvSnapshot(criteria),
      this.inventoryKpis.generateTurnoverSnapshot(criteria),
      this.marketingKpis.generateCacSnapshot(criteria),
      this.workforceKpis.generateLaborCostSnapshot(criteria)
    ]);
    return results;
  }

  @Get('dashboard')
  async getDashboard(@Query() criteria: KpiFilterCriteria): Promise<{ dashboard: KpiSnapshot[] }> {
    const kpis = await this.getAllKpis(criteria);
    return { dashboard: kpis };
  }

  @Get('history')
  async getKpiHistory(@Query() criteria: KpiFilterCriteria): Promise<KpiHistory[]> {
    return [
      {
        kpiId: 'FIN-001',
        code: 'REV_GROSS',
        period: 'MONTHLY',
        dataPoints: [
          { timestamp: new Date(new Date().setMonth(new Date().getMonth() - 1)), value: 100000 },
          { timestamp: new Date(), value: 115000 }
        ]
      }
    ];
  }

  @Get('trends')
  async getKpiTrends(@Query() criteria: KpiFilterCriteria): Promise<KpiTrend[]> {
    return [
      {
        kpiId: 'FIN-001',
        code: 'REV_GROSS',
        currentValue: 115000,
        previousValue: 100000,
        trendDirection: 'UP',
        changePercentage: 15,
        timeframe: 'MoM'
      }
    ];
  }
}
