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
