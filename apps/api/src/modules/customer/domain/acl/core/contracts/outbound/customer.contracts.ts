export interface CustomerContract {
  customerId: string;
  status: string;
}
export interface CustomerSummaryContract {
  customerId: string;
  name: string;
}
export interface CustomerEligibilityContract {
  customerId: string;
  isEligible: boolean;
}
export interface CustomerIdentityContract {
  customerId: string;
  email: string;
}
export interface CustomerConsentContract {
  customerId: string;
  hasConsent: boolean;
}