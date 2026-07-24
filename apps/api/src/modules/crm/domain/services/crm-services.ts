import { IDomainService } from '@saas/core';

export class LeadQualificationService implements IDomainService {
  public canQualify(score: number, hasEmail: boolean, hasPhone: boolean): boolean {
    return score >= 50 && (hasEmail || hasPhone);
  }
}

export class LeadScoringService implements IDomainService {
  public calculateScore(industry: string, revenue: number, contactCount: number): number {
    let score = 10; // Base score
    if (industry === 'Technology' || industry === 'Enterprise') score += 20;
    if (revenue > 100000) score += 30;
    else if (revenue > 10000) score += 15;
    score += Math.min(contactCount * 5, 20);
    return Math.min(score, 100);
  }
}

export class LeadConversionService implements IDomainService {
  public generateOpportunityReference(leadId: string): string {
    return `OPP-${leadId.substring(0, 8).toUpperCase()}`;
  }
}

export class OpportunityScoringService implements IDomainService {
  public evaluateProbability(stage: string, durationDays: number, contactCount: number): number {
    let probability = 10;
    if (stage === 'PROPOSAL') probability += 20;
    if (stage === 'NEGOTIATION') probability += 50;
    if (contactCount > 5) probability += 10;
    if (durationDays > 90) probability -= 20;
    return Math.max(0, Math.min(100, probability));
  }
}

export class PipelineEvaluationService implements IDomainService {
  public evaluatePipelineHealth(winProbability: number, revenue: number, daysStagnant: number): string {
    if (daysStagnant > 60) return 'AT_RISK';
    if (winProbability > 70 && revenue > 50000) return 'HEALTHY';
    return 'NEEDS_ATTENTION';
  }
}

export class SalesForecastService implements IDomainService {
  public calculateWeightedForecast(revenue: number, winProbability: number): number {
    return revenue * (winProbability / 100);
  }
}
