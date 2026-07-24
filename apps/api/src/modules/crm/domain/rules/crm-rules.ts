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

export class ParticipantSpecification extends Specification<{ participantsCount: number }> {
  public isSatisfiedBy(context: { participantsCount: number }): boolean {
    return context.participantsCount >= 1;
  }
}

export class FollowUpSpecification extends Specification<{ interactionDate: Date, followUpDate: Date }> {
  public isSatisfiedBy(context: { interactionDate: Date, followUpDate: Date }): boolean {
    return context.followUpDate >= context.interactionDate;
  }
}

export class InteractionStatusSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status === 'OPEN';
  }
}

export class InteractionChannelSpecification extends Specification<{ channel: string }> {
  public isSatisfiedBy(context: { channel: string }): boolean {
    const valid = [
      'PHONE', 'EMAIL', 'SMS', 'WHATSAPP', 'TELEGRAM', 
      'FACEBOOK_MESSENGER', 'INSTAGRAM_DIRECT', 'WEBSITE_CHAT', 
      'POS', 'IN_PERSON_MEETING', 'VIDEO_MEETING'
    ];
    return valid.includes(context.channel);
  }
}

export class JourneyStageSpecification extends Specification<{ currentStage: string, nextStage: string }> {
  public isSatisfiedBy(context: { currentStage: string, nextStage: string }): boolean {
    const stageSequence = [
      'ANONYMOUS', 'LEAD', 'QUALIFIED_LEAD', 'OPPORTUNITY', 
      'CUSTOMER', 'RETURNING_CUSTOMER', 'VIP'
    ];
    const currentIndex = stageSequence.indexOf(context.currentStage);
    const nextIndex = stageSequence.indexOf(context.nextStage);
    
    // Can jump forward, but generally not backward unless going to INACTIVE/LOST
    return nextIndex > currentIndex || ['INACTIVE', 'LOST'].includes(context.nextStage);
  }
}

export class JourneyHealthSpecification extends Specification<{ score: number }> {
  public isSatisfiedBy(context: { score: number }): boolean {
    return context.score >= 0 && context.score <= 100;
  }
}

export class JourneyMilestoneSpecification extends Specification<{ sequence: number, latestSequence: number }> {
  public isSatisfiedBy(context: { sequence: number, latestSequence: number }): boolean {
    return context.sequence > context.latestSequence;
  }
}

export class JourneyStatusSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(context: { status: string }): boolean {
    return context.status === 'ACTIVE' || context.status === 'PAUSED';
  }
}

export class EngagementTimelineSpecification extends Specification<{ newEventTime: Date, lastEventTime: Date | null }> {
  public isSatisfiedBy(context: { newEventTime: Date, lastEventTime: Date | null }): boolean {
    if (!context.lastEventTime) return true;
    return context.newEventTime.getTime() >= context.lastEventTime.getTime();
  }
}

export class ConversionSpecification extends Specification<{ isAlreadyConverted: boolean }> {
  public isSatisfiedBy(context: { isAlreadyConverted: boolean }): boolean {
    return !context.isAlreadyConverted;
  }
}

export class ResponseSpecification extends Specification<{ responseType: string }> {
  public isSatisfiedBy(context: { responseType: string }): boolean {
    const validResponses = [
      'Opened', 'Clicked', 'Visited Website', 'Downloaded Resource', 
      'Registered', 'Purchased', 'Unsubscribed', 'Spam Complaint', 
      'Hard Bounce', 'Soft Bounce'
    ];
    return validResponses.includes(context.responseType);
  }
}
