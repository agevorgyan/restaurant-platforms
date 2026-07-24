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
