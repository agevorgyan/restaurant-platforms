export interface LeadAnalyticsReadModel {
  totalLeads: number;
  qualifiedLeads: number;
  disqualifiedLeads: number;
  leadConversionRate: number;
  leadQualificationRate: number;
  leadsBySource: Record<string, number>;
  leadsByIndustry: Record<string, number>;
}

export interface OpportunityAnalyticsReadModel {
  totalOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  winRate: number;
  lossRate: number;
  averageSalesCycleDays: number;
  averageDealSize: number;
  winReasons: Record<string, number>;
  lossReasons: Record<string, number>;
}

export interface PipelineAnalyticsReadModel {
  pipelineValue: number;
  pipelineVelocity: number; // Avg days to move through stages
  opportunitiesByStage: Record<string, number>;
  valueByStage: Record<string, number>;
  bottlenecks: string[];
}

export interface SalesForecastReadModel {
  period: string; // e.g., 'Q3-2026'
  expectedRevenue: number;
  bestCaseRevenue: number;
  commitRevenue: number;
  forecastByRepresentative: Record<string, number>;
}

export interface CustomerJourneyAnalyticsReadModel {
  activeJourneys: number;
  completedJourneys: number;
  averageJourneyDurationDays: number;
  customerHealthScoreAverage: number;
  churnRiskCount: number;
  journeysByStage: Record<string, number>;
}

export interface ActivityAnalyticsReadModel {
  totalActivities: number;
  completedActivities: number;
  overdueActivities: number;
  activityCompletionRate: number;
  activitiesByType: Record<string, number>;
}

export interface InteractionAnalyticsReadModel {
  totalInteractions: number;
  interactionsByChannel: Record<string, number>;
  followUpComplianceRate: number; // percentage of follow-ups completed on time
}

export interface CampaignAnalyticsReadModel {
  campaignId: string;
  totalEngagements: number;
  campaignROI: number;
  campaignConversionRate: number;
  opens: number;
  clicks: number;
  visits: number;
  conversions: number;
  bounces: number;
  unsubscribes: number;
}

export interface SalesPerformanceReadModel {
  representativeId: string;
  quotaAttainment: number;
  dealsWon: number;
  revenueGenerated: number;
  averageDealSize: number;
  salesCycleLengthDays: number;
}

export interface ConversionFunnelReadModel {
  funnelName: string; // e.g., "Standard Acquisition"
  stages: {
    stageName: string;
    count: number;
    dropoffRate: number;
    conversionRate: number;
  }[];
}

export interface CrmDashboardReadModel {
  leadAnalytics: LeadAnalyticsReadModel;
  pipelineAnalytics: PipelineAnalyticsReadModel;
  opportunityAnalytics: OpportunityAnalyticsReadModel;
  salesForecast: SalesForecastReadModel;
  customerHealthScore: number;
  churnRiskCount: number;
  topPerformingCampaigns: CampaignAnalyticsReadModel[];
}
