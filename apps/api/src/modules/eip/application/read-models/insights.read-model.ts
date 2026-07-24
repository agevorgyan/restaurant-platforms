export interface InsightSnapshot {
  insightId: string;
  type: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  priority: string;
  confidenceScore: number;
  businessImpact: string;
  generatedAt: Date;
  targetId: string;
}

export interface Recommendation {
  recommendationId: string;
  insightId: string;
  title: string;
  actionableSteps: string[];
  estimatedImpactValue: number;
  impactCurrency?: string;
  recommendationScore: number;
}

export interface BusinessRisk {
  riskId: string;
  insightId: string;
  riskType: string;
  probabilityScore: number;
  potentialLossValue: number;
  mitigationSteps: string[];
}

export interface Anomaly {
  anomalyId: string;
  insightId: string;
  metric: string;
  expectedRange: { min: number, max: number };
  actualValue: number;
  deviationPercentage: number;
  detectedAt: Date;
}

export interface OptimizationOpportunity {
  opportunityId: string;
  insightId: string;
  domain: string;
  currentEfficiencyScore: number;
  targetEfficiencyScore: number;
  requiredActions: string[];
}

export interface InsightHistory {
  targetId: string;
  period: string;
  historicalInsights: InsightSnapshot[];
}
