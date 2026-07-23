export class CampaignEligibilitySpecification {
  public static isEligible(context: any): boolean {
    return !!context.campaignRef;
  }
}

export class CustomerSegmentationSpecification {
  public static matchesSegment(context: any): boolean {
    return !!context.currentSegment;
  }
}

export class ConsentSpecification {
  public static hasConsent(context: any): boolean {
    return !!context.currentConsent;
  }
}

export class MarketingPreferenceSpecification {
  public static allowsChannel(channel: string, preferences: string[]): boolean {
    return preferences.includes(channel);
  }
}

export class AudienceSpecification {
  public static isInAudience(context: any, audience: any): boolean {
    void context; void audience;
    return true;
  }
}