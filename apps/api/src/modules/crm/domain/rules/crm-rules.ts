import { Specification } from '@saas/domain-rules';

export class LeadQualificationSpecification extends Specification<{ score: number, hasRequiredContactInfo: boolean }> {
  public isSatisfiedBy(context: { score: number, hasRequiredContactInfo: boolean }): boolean {
    return context.score >= 50 && context.hasRequiredContactInfo;
  }
}

export class LeadScoreSpecification extends Specification<{ score: number }> {
  public isSatisfiedBy(context: { score: number }): boolean {
    return context.score >= 0 && context.score <= 100;
  }
}

export class LeadConversionSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status === 'QUALIFIED';
  }
}

export class OpportunityStageSpecification extends Specification<{ currentStage: string, nextStage: string }> {
  public isSatisfiedBy(context: { currentStage: string, nextStage: string }): boolean {
    const stages = ['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CLOSED'];
    const currentIndex = stages.indexOf(context.currentStage);
    const nextIndex = stages.indexOf(context.nextStage);
    return currentIndex !== -1 && nextIndex > currentIndex;
  }
}

export class WinProbabilitySpecification extends Specification<{ probability: number }> {
  public isSatisfiedBy(context: { probability: number }): boolean {
    return context.probability >= 0 && context.probability <= 100;
  }
}

export class OpportunityStatusSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status === 'OPEN';
  }
}

export class RevenueSpecification extends Specification<{ amount: number }> {
  public isSatisfiedBy(context: { amount: number }): boolean {
    return context.amount >= 0;
  }
}
