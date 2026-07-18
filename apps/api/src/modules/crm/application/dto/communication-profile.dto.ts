export interface PrivacyPreferenceDto {
  marketingOptIn: boolean;
  dataSharingOptIn: boolean;
  trackingOptIn: boolean;
}

export interface QuietHoursDto {
  startTime: string;
  endTime: string;
}

export interface CreateCommunicationProfileDto {
  restaurantId: string;
  customerId: string;
  preferredLanguage: string;
  preferredChannels: string[];
  quietHours?: QuietHoursDto;
  privacyPreferences: PrivacyPreferenceDto;
}

export interface GrantConsentDto {
  purpose: string;
  source: string;
  version: string;
}

export interface RevokeConsentDto {
  purpose: string;
}
