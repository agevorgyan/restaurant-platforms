import { Controller, Get, Query } from '@nestjs/common';
import { 
  ReportFilterCriteria,
  LeadReportGenerator,
  PipelineReportGenerator,
  SalesForecastGenerator,
  JourneyAnalyticsGenerator,
  ActivityAnalyticsGenerator,
  CampaignAnalyticsGenerator,
  CustomerHealthGenerator
} from '../../application/services';
import { CrmDashboardReadModel } from '../../application/read-models';

@Controller('crm/reports')
export class CrmReportingController {
  constructor(
    private readonly leadReports: LeadReportGenerator,
    private readonly pipelineReports: PipelineReportGenerator,
    private readonly salesForecasts: SalesForecastGenerator,
    private readonly journeyAnalytics: JourneyAnalyticsGenerator,
    private readonly activityAnalytics: ActivityAnalyticsGenerator,
    private readonly campaignAnalytics: CampaignAnalyticsGenerator,
    private readonly customerHealth: CustomerHealthGenerator
  ) {}

  @Get('dashboard')
  async getDashboard(@Query() criteria: ReportFilterCriteria): Promise<CrmDashboardReadModel> {
    const leadAnalytics = await this.leadReports.generateAnalytics(criteria);
    const pipelineAnalytics = await this.pipelineReports.generateAnalytics(criteria);
    const opportunityAnalytics = await this.pipelineReports.generateOpportunityAnalytics(criteria);
    const salesForecast = await this.salesForecasts.generateForecast(criteria);
    const campaignAnalytics = await this.campaignAnalytics.generateAnalytics(criteria);
    
    // In a real application, health score and churn risk would be aggregated across customers
    const healthScore = 85; 
    const churnRiskCount = 5;

    return {
      leadAnalytics,
      pipelineAnalytics,
      opportunityAnalytics,
      salesForecast,
      customerHealthScore: healthScore,
      churnRiskCount,
      topPerformingCampaigns: campaignAnalytics
    };
  }

  @Get('leads')
  async getLeadsReport(@Query() criteria: ReportFilterCriteria) {
    return this.leadReports.generateAnalytics(criteria);
  }

  @Get('opportunities')
  async getOpportunitiesReport(@Query() criteria: ReportFilterCriteria) {
    return this.pipelineReports.generateOpportunityAnalytics(criteria);
  }

  @Get('pipeline')
  async getPipelineReport(@Query() criteria: ReportFilterCriteria) {
    return this.pipelineReports.generateAnalytics(criteria);
  }

  @Get('forecast')
  async getForecastReport(@Query() criteria: ReportFilterCriteria) {
    return this.salesForecasts.generateForecast(criteria);
  }

  @Get('journeys')
  async getJourneysReport(@Query() criteria: ReportFilterCriteria) {
    return this.journeyAnalytics.generateAnalytics(criteria);
  }

  @Get('activities')
  async getActivitiesReport(@Query() criteria: ReportFilterCriteria) {
    const activityStats = await this.activityAnalytics.generateActivityAnalytics(criteria);
    const interactionStats = await this.activityAnalytics.generateInteractionAnalytics(criteria);
    return { ...activityStats, ...interactionStats };
  }

  @Get('campaigns')
  async getCampaignsReport(@Query() criteria: ReportFilterCriteria) {
    return this.campaignAnalytics.generateAnalytics(criteria);
  }

  @Get('customers/health')
  async getCustomersHealthReport(@Query() criteria: ReportFilterCriteria) {
    return this.customerHealth.evaluateChurnRisk(criteria);
  }
}
