

export class LeadQualificationService {
  public canQualify(score: number, hasEmail: boolean, hasPhone: boolean): boolean {
    return score >= 50 && (hasEmail || hasPhone);
  }
}

export class LeadScoringService {
  public calculateScore(industry: string, revenue: number, contactCount: number): number {
    let score = 10; // Base score
    if (industry === 'Technology' || industry === 'Enterprise') score += 20;
    if (revenue > 100000) score += 30;
    else if (revenue > 10000) score += 15;
    score += Math.min(contactCount * 5, 20);
    return Math.min(score, 100);
  }

  public evaluateScore(score: number): string {
    if (score >= 80) return 'HOT';
    if (score >= 50) return 'WARM';
    return 'COLD';
  }
}

export class LeadConversionService {
  public generateOpportunityReference(leadId: string): string {
    return `OPP-${leadId.substring(0, 8).toUpperCase()}`;
  }
}

export class OpportunityScoringService {
  public evaluateProbability(stage: string, durationDays: number, contactCount: number): number {
    let probability = 10;
    if (stage === 'PROPOSAL') probability += 20;
    if (stage === 'NEGOTIATION') probability += 50;
    if (contactCount > 5) probability += 10;
    if (durationDays > 90) probability -= 20;
    return Math.max(0, Math.min(100, probability));
  }
}

export class PipelineEvaluationService {
  public evaluatePipelineHealth(winProbability: number, revenue: number, daysStagnant: number): string {
    if (daysStagnant > 60) return 'AT_RISK';
    if (winProbability > 70 && revenue > 50000) return 'HEALTHY';
    return 'NEEDS_ATTENTION';
  }
}

export class SalesForecastService {
  public calculateWeightedForecast(revenue: number, winProbability: number): number {
    return revenue * (winProbability / 100);
  }
}

export class InteractionTimelineService {
  public validateFollowUpTiming(interactionDate: Date, followUpDate: Date): boolean {
    // Follow-up cannot precede interaction
    return followUpDate >= interactionDate;
  }
}

export class CommunicationSummaryService {
  public summarizeInteractions(interactions: any[]): { count: number, totalDuration: number, lastContact: Date | null } {
    if (interactions.length === 0) return { count: 0, totalDuration: 0, lastContact: null };
    
    // Sort descending by date
    const sorted = interactions.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
    const totalDuration = interactions.reduce((sum, int) => sum + (int.duration || 0), 0);
    
    return {
      count: interactions.length,
      totalDuration,
      lastContact: sorted[0].occurredAt
    };
  }
}

export class FollowUpRecommendationService {
  public recommendFollowUpDate(channel: string, priority: string): Date {
    const today = new Date();
    let daysToAdd = 3; // Default
    
    if (priority === 'HIGH' || priority === 'URGENT') {
      daysToAdd = 1;
    } else if (channel === 'EMAIL' && priority === 'LOW') {
      daysToAdd = 7;
    }
    
    const followUp = new Date(today);
    followUp.setDate(today.getDate() + daysToAdd);
    return followUp;
  }
}
