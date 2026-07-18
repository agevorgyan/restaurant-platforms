import { PreferredLanguage } from '../value-objects/preferred-language.value-object';
import { PreferredChannel } from '../value-objects/preferred-channel.value-object';
import { QuietHours } from '../value-objects/quiet-hours.value-object';
import { PrivacyPreference } from '../value-objects/privacy-preference.value-object';
import { IConsentRecord } from './consent-record.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ICommunicationProfile {
  id: string;
  restaurantId: string;
  customerId: string;
  preferredLanguage: PreferredLanguage;
  preferredChannels: PreferredChannel[];
  quietHours?: QuietHours;
  privacyPreferences: PrivacyPreference;
  consentRecords: IConsentRecord[];
  domainEvents?: IDomainEvent[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
