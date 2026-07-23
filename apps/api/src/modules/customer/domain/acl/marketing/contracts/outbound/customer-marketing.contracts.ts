export interface CustomerSegmentRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}

export interface CampaignEligibilityRequestedContract {
  version: '1.0';
  customerId: string;
  campaignId: string;
  requestedAt: Date;
}

export interface MarketingConsentRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}

export interface CustomerCommunicationPreferenceRequestedContract {
  version: '1.0';
  customerId: string;
  requestedAt: Date;
}