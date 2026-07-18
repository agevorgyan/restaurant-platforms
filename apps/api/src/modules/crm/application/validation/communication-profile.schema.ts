import { CreateCommunicationProfileDto, GrantConsentDto, RevokeConsentDto } from '../dto/communication-profile.dto';

export function validateCreateCommunicationProfile(dto: CreateCommunicationProfileDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.customerId) errors.push('customerId is required');
  if (!dto.preferredLanguage) errors.push('preferredLanguage is required');
  if (!dto.preferredChannels || dto.preferredChannels.length === 0) errors.push('preferredChannels must have at least one channel');
  if (!dto.privacyPreferences) errors.push('privacyPreferences is required');
  
  if (dto.preferredChannels && new Set(dto.preferredChannels).size !== dto.preferredChannels.length) {
    errors.push('Preferred channels must be unique');
  }

  return errors;
}

export function validateGrantConsent(dto: GrantConsentDto): string[] {
  const errors: string[] = [];
  if (!dto.purpose) errors.push('purpose is required');
  if (!dto.source) errors.push('source is required');
  if (!dto.version) errors.push('version is required');
  return errors;
}

export function validateRevokeConsent(dto: RevokeConsentDto): string[] {
  const errors: string[] = [];
  if (!dto.purpose) errors.push('purpose is required');
  return errors;
}
