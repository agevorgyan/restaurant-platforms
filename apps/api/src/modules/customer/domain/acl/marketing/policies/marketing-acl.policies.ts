export class CampaignEligibilityPolicy {
  public static enforce(context: any): void {
    if (!context) throw new Error('Context required');
  }
}

export class CustomerSegmentationPolicy {
  public static evaluate(context: any): boolean {
    return !!context.customerRef;
  }
}

export class ConsentPolicy {
  public static validate(consent: any): void {
    if (!consent) throw new Error('Consent cannot be verified');
  }
}

export class MarketingCommunicationPolicy {
  public static enforce(allowedChannels: string[], requiredChannel: string): void {
    if (!allowedChannels.includes(requiredChannel)) {
      throw new Error(`Channel ${requiredChannel} is not allowed`);
    }
  }
}

export class SubscriptionPolicy {
  public static check(sub: any): void {
    void sub;
  }
}