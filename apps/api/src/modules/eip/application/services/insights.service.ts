import { 
  InsightSnapshot, 
  Recommendation, 
  BusinessRisk, 
  Anomaly, 
  OptimizationOpportunity 
} from '../read-models';

export class ExplanationService {
  public generateExplanation(metric: string, deviation: number): string {
    if (deviation > 0) {
      return `The ${metric} is currently overperforming the benchmark by ${deviation.toFixed(2)}%. This is driven primarily by increased weekend volume.`;
    } else {
      return `The ${metric} is underperforming by ${Math.abs(deviation).toFixed(2)}%. This drop correlates strongly with the recent menu pricing updates.`;
    }
  }
}

export class RecommendationService {
  public generateRecommendations(insightId: string, category: string): Recommendation[] {
    if (category === 'RISK') {
      return [{
        recommendationId: crypto.randomUUID(),
        insightId,
        title: 'Review Staffing Matrix',
        actionableSteps: ['Cut 2 servers from Monday evening shift.', 'Cross-train kitchen staff for prep.'],
        estimatedImpactValue: 1200,
        impactCurrency: 'USD',
        recommendationScore: 85
      }];
    }
    
    return [{
      recommendationId: crypto.randomUUID(),
      insightId,
      title: 'Optimize Menu Pricing',
      actionableSteps: ['Increase price of Top Seller A by 5%.', 'Bundle low-performing Item B.'],
      estimatedImpactValue: 3500,
      impactCurrency: 'USD',
      recommendationScore: 92
    }];
  }
}

export class AnomalyDetectionService {
  public detectAnomalies(targetId: string, dataSeries: number[]): Anomaly[] {
    // Mock anomaly detection logic
    if (dataSeries.length === 0) return [];
    const mean = dataSeries.reduce((a, b) => a + b, 0) / dataSeries.length;
    
    return [{
      anomalyId: crypto.randomUUID(),
      insightId: crypto.randomUUID(),
      metric: 'LaborCostPercent',
      expectedRange: { min: 25, max: 30 },
      actualValue: 35,
      deviationPercentage: 16.6,
      detectedAt: new Date()
    }];
  }
}

export class RiskAssessmentService {
  public evaluateRisks(targetId: string): BusinessRisk[] {
    return [{
      riskId: crypto.randomUUID(),
      insightId: crypto.randomUUID(),
      riskType: 'CHURN_RISK',
      probabilityScore: 65,
      potentialLossValue: 15000,
      mitigationSteps: ['Launch automated re-engagement campaign.', 'Offer 15% discount for next visit.']
    }];
  }
}

export class InsightGenerationService {
  constructor(
    private readonly explanationService: ExplanationService,
    private readonly recommendationService: RecommendationService,
    private readonly anomalyService: AnomalyDetectionService,
    private readonly riskService: RiskAssessmentService
  ) {}

  public async generateInsights(targetId: string, contextData: any): Promise<{
    insights: InsightSnapshot[],
    recommendations: Recommendation[],
    anomalies: Anomaly[],
    risks: BusinessRisk[]
  }> {
    
    const insightId = crypto.randomUUID();
    
    // 1. Detect Anomalies
    const anomalies = this.anomalyService.detectAnomalies(targetId, contextData?.historicalSeries || []);
    
    // 2. Evaluate Risks
    const risks = this.riskService.evaluateRisks(targetId);
    
    // 3. Generate Base Insight Snapshot
    const insights: InsightSnapshot[] = [{
      insightId,
      type: 'OPERATIONAL',
      category: anomalies.length > 0 ? 'ANOMALY' : 'TREND',
      title: 'Labor Cost Spike Detected',
      description: this.explanationService.generateExplanation('LaborCostPercent', -16.6),
      severity: 'HIGH',
      priority: 'URGENT',
      confidenceScore: 94,
      businessImpact: 'COST_REDUCTION',
      generatedAt: new Date(),
      targetId
    }];

    // 4. Generate Recommendations
    const recommendations = this.recommendationService.generateRecommendations(insightId, insights[0].category);

    return {
      insights,
      recommendations,
      anomalies,
      risks
    };
  }
}
